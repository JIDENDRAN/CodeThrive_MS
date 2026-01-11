import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { getProjects} from "../services/api";
import { toast } from "react-toastify";


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [savingId, setSavingId] = useState(null);


  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEditClick = (project) => {
    setEditId(project.id);
    setEditData(JSON.parse(JSON.stringify(project))); // deep clone
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      setSavingId(id);
  
      const payload = {
        ...editData,
        total_fee: Number(editData.total_fee) || 0,
        students: editData.students || [],
        client: editData.client || {},
        guides: editData.guides || [],
        payments: editData.payments || [],
      };
  
      const res = await api.put(`/projects/${id}`, payload);
  
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? res.data : p))
      );
      toast.success("Project updated successfully");
      setEditId(null);
      setEditData({});
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    } finally {
      setSavingId(null);
    }
  };
  

  /* ================= FIELD HANDLERS ================= */
  const handleChange = (field, value) =>
    setEditData({ ...editData, [field]: value });

  const handleStudentChange = (i, field, value) => {
    const students = [...(editData.students || [])];
    students[i][field] = value;
    setEditData({ ...editData, students });
  };

  const handleClientChange = (field, value) =>
    setEditData({
      ...editData,
      client: { ...editData.client, [field]: value },
    });

  const handlePaymentChange = (i, field, value) => {
    const payments = [...(editData.payments || [])];
    payments[i][field] = value;
    setEditData({ ...editData, payments });
  };

  /* ================= FILTER ================= */
  const filteredProjects = projects.filter((p) => {
    const matchesType = filterType === "ALL" || p.project_type === filterType;
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      p.id.toString().includes(search) ||
      (p.project_type === "STUDENT"
        ? p.students?.some((s) =>
            [s.name, s.phone].some((v) =>
              v?.toLowerCase().includes(search)
            )
          )
        : [p.client?.name, p.client?.phone].some((v) =>
            v?.toLowerCase().includes(search)
          ));

    return matchesType && matchesSearch;
  });

  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20  }}>Projects</h1>

      {/* Search & Filter */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: "6px 10px" }}
        >
          <option value="ALL">All Types</option>
          <option value="STUDENT">Student</option>
          <option value="CLIENT">Client</option>
        </select>
        <input
          type="text"
          placeholder="Search by ID, Name or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "6px 10px", flex: 1 }}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Title</th>
              <th>Technology</th>
              <th>Total Fee</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <React.Fragment key={p.id}>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.project_type}</td>

                  {/* Name */}
                  <td>
                    {p.project_type === "STUDENT"
                      ? editId === p.id
                        ? editData.students?.map((s, i) => (
                            <input
                              key={i}
                              value={s.name}
                              onChange={(e) => handleStudentChange(i, "name", e.target.value)}
                              placeholder={`Student ${i + 1}`}
                              style={{ width: "100%", marginBottom: 4 }}
                            />
                          ))
                        : p.students?.map((s) => s.name).join(", ")
                      : editId === p.id
                      ? (
                        <input
                          value={editData.client?.name || ""}
                          onChange={(e) => handleClientChange("name", e.target.value)}
                          style={{ width: "100%" }}
                        />
                      )
                      : p.client?.name}
                  </td>

                  {/* Phone */}
                  <td>
                    {p.project_type === "STUDENT"
                      ? editId === p.id
                        ? editData.students?.map((s, i) => (
                            <input
                              key={i}
                              value={s.phone}
                              onChange={(e) => handleStudentChange(i, "phone", e.target.value)}
                              placeholder={`Phone ${i + 1}`}
                              style={{ width: "100%", marginBottom: 4 }}
                            />
                          ))
                        : p.students?.map((s) => s.phone).join(", ")
                      : editId === p.id
                      ? (
                        <input
                          value={editData.client?.phone || ""}
                          onChange={(e) => handleClientChange("phone", e.target.value)}
                          style={{ width: "100%" }}
                        />
                      )
                      : p.client?.phone}
                  </td>

                  {/* Other project fields */}
                  <td>{editId === p.id ? <input value={editData.title} onChange={(e) => handleChange("title", e.target.value)} /> : p.title}</td>
                  <td>{editId === p.id ? <input value={editData.technology} onChange={(e) => handleChange("technology", e.target.value)} /> : p.technology}</td>
                  <td>{editId === p.id ? <input type="number" value={editData.total_fee} onChange={(e) => handleChange("total_fee", e.target.value)} /> : p.total_fee}</td>
                  <td>{editId === p.id ? (
                      <select value={editData.status} onChange={(e) => handleChange("status", e.target.value)}>
                        <option>NOT_STARTED</option>
                        <option>IN_PROGRESS</option>
                        <option>COMPLETED</option>
                      </select>
                    ) : p.status}
                  </td>

                  {/* Payments */}
                  {editId === p.id ? (
                    editData.payments?.map((pay, i) => (
                      <React.Fragment key={i}>
                        <td><input type="number" value={pay.paid_amount} onChange={(e) => handlePaymentChange(i, "paid_amount", e.target.value)} /></td>
                        <td><input type="number" value={pay.balance_amount} onChange={(e) => handlePaymentChange(i, "balance_amount", e.target.value)} /></td>
                        <td>
                          <select value={pay.payment_status} onChange={(e) => handlePaymentChange(i, "payment_status", e.target.value)}>
                            <option>PAID</option>
                            <option>PENDING</option>
                          </select>
                        </td>
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <td>{p.payments?.map((pay) => pay.paid_amount).join(", ")}</td>
                      <td>{p.payments?.map((pay) => pay.balance_amount).join(", ")}</td>
                      <td>{p.payments?.map((pay) => pay.payment_status).join(", ")}</td>
                    </>
                  )}

                  {/* Actions */}
                  <td style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {editId === p.id ? (
                      <>
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={savingId === p.id}
                          style={{ background: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
                        >
                          💾 {savingId === p.id ? "Saving..." : ""}
                        </button>
                        <button
                          onClick={handleCancel}
                          style={{ background: "#f44336", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} style={{ background: "#2196F3", border: "none", borderRadius: "20%", padding: 6, cursor: "pointer", color: "#fff" }} title="View">
                          <AiOutlineEye size={18} />
                        </button>
                        <button onClick={() => handleEditClick(p)} style={{ background: "#FFC107", border: "none", borderRadius: "20%", padding: 6, cursor: "pointer", color: "#fff" }} title="Edit">
                          <AiOutlineEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: "#F44336", border: "none", borderRadius: "20%", padding: 6, cursor: "pointer", color: "#fff" }} title="Delete">
                          <AiOutlineDelete size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>

                {/* Expanded row */}
                {expandedId === p.id && (
                  <tr>
                    <td colSpan="12" style={{ background: "#f9f9f9", padding: "12px 10px" }}>
                      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, whiteSpace: "nowrap" }}>
                        {/* Description */}
                        <div style={{ minWidth: 200, background: "#e3f2fd", padding: 10, borderRadius: 6 }}>
                          <strong>Description:</strong>
                          <p>{p.description}</p>
                        </div>

                        {/* Students / Client */}
                        {p.project_type === "STUDENT" ? (
                          <div style={{ display: "flex", gap: 10 }}>
                            {p.students?.map((s, i) => (
                              <div key={i} style={{ minWidth: 180, background: "#fff3e0", padding: 8, borderRadius: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                                <strong>Student {i + 1}</strong>
                                <p>Name: {s.name}</p>
                                <p>Phone: {s.phone}</p>
                                <p>College: {s.college}</p>
                                <p>Batch: {s.batch}</p>
                                <p>Email: {s.email}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ minWidth: 200, background: "#fff3e0", padding: 10, borderRadius: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <strong>Client</strong>
                            <p>Name: {p.client?.name}</p>
                            <p>Phone: {p.client?.phone}</p>
                            <p>Company: {p.client?.company}</p>
                            <p>Email: {p.client?.email}</p>
                          </div>
                        )}

                        {/* Payments */}
                        <div style={{ minWidth: 250, background: "#fffde7", padding: 10, borderRadius: 6 }}>
                          <strong>Payments:</strong>
                          {p.payments?.length > 0 ? (
                            <div style={{ display: "flex", gap: 8 }}>
                              {p.payments.map((pay, i) => (
                                <div key={i} style={{ minWidth: 150, background: "#fff", padding: 6, borderRadius: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                  <p>Paid: {pay.paid_amount}</p>
                                  <p>Balance: {pay.balance_amount}</p>
                                  <p>Status: {pay.payment_status}</p>
                                  <p>Date: {pay.payment_date || "-"}</p>
                                  <p>Method: {pay.payment_method || "-"}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>No payments</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Projects;
