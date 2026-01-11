import { useEffect, useState } from "react";
import { addProject } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateProject() {
  const navigate = useNavigate();

  // ---------- Project Core ----------
  const [projectType, setProjectType] = useState("STUDENT");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technology, setTechnology] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [loading, setLoading] = useState(false);

  // ---------- Student ----------
  const [student, setStudent] = useState({
    name: "",
    college: "",
    batch: "",
    phone: "",
    email: "",
  });

  // ---------- Guide (COMMON for both Student & Client) ----------
  const [guide, setGuide] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // ---------- Client ----------
  const [client, setClient] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  // ---------- Payment ----------
  const [payment, setPayment] = useState({
    paid_amount: "",
    balance_amount: "",
    payment_status: "PENDING",
    payment_date: "",
    payment_method: "",
  });

  // ---------- Auto Balance Calculation ----------
  useEffect(() => {
    if (totalFee && payment.paid_amount) {
      setPayment((prev) => ({
        ...prev,
        balance_amount: Number(totalFee) - Number(prev.paid_amount),
      }));
    }
  }, [totalFee, payment.paid_amount]);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalFeeNum = Number(totalFee);
    const paidAmountNum = Number(payment.paid_amount || 0);
    const balanceAmountNum = totalFeeNum - paidAmountNum;

    if (paidAmountNum > totalFeeNum) {
      toast.error("Paid amount cannot exceed total fee");
      return;
    }

    const projectPayload = {
      project_type: projectType,
      title,
      description,
      technology,
      total_fee: totalFeeNum,
      status,

      students: projectType === "STUDENT" ? [student] : [],
      client: projectType === "CLIENT" ? client : null,

      guides: [guide], // ✅ GUIDE FOR BOTH

      payments: [
        {
          paid_amount: paidAmountNum,
          balance_amount: balanceAmountNum,
          payment_status:
            paidAmountNum === totalFeeNum ? "PAID" : "PENDING",
          payment_date: payment.payment_date || null,
          payment_method: payment.payment_method || "CASH",
        },
      ],
    };

    try {
      setLoading(true);
      await addProject(projectPayload);
      toast.success("Project created successfully");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to create project");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- Styles ----------
  const sectionStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  };

  const inputStyle = {
    padding: "10px",
    width: "100%",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  };

  const buttonStyle = {
    padding: "14px 28px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  };

  // ---------- UI ----------
  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        minHeight: "calc(100vh - 60px)",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Create Project
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        {/* Project Type */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Project Type</label>
          <select
            style={inputStyle}
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            <option value="STUDENT">Student Project</option>
            <option value="CLIENT">Client Project</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={sectionStyle}>
              <label style={labelStyle}>Project Title</label>
              <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />

              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, height: 90 }} value={description} onChange={(e) => setDescription(e.target.value)} required />

              <label style={labelStyle}>Technology</label>
              <input style={inputStyle} value={technology} onChange={(e) => setTechnology(e.target.value)} required />

              <label style={labelStyle}>Total Fee</label>
              <input type="number" style={inputStyle} value={totalFee} onChange={(e) => setTotalFee(e.target.value)} required />

              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="NOT_STARTED">NOT_STARTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            {/* GUIDE (COMMON) */}
            <div style={sectionStyle}>
              <h4>Guide Details</h4>
              <input style={inputStyle} placeholder="Guide Name" value={guide.name} onChange={(e) => setGuide({ ...guide, name: e.target.value })} />
              {/* <input style={inputStyle} placeholder="Guide Phone" value={guide.phone} onChange={(e) => setGuide({ ...guide, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Guide Email" value={guide.email} onChange={(e) => setGuide({ ...guide, email: e.target.value })} /> */}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, minWidth: 320 }}>
            {projectType === "STUDENT" && (
              <div style={sectionStyle}>
                <h4>Student Details</h4>
                <input style={inputStyle} placeholder="Name" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                <input style={inputStyle} placeholder="College" value={student.college} onChange={(e) => setStudent({ ...student, college: e.target.value })} />
                <input style={inputStyle} placeholder="Batch" value={student.batch} onChange={(e) => setStudent({ ...student, batch: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={student.phone} onChange={(e) => setStudent({ ...student, phone: e.target.value })} />
                <input style={inputStyle} placeholder="Email" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} />
              </div>
            )}

            {projectType === "CLIENT" && (
              <div style={sectionStyle}>
                <h4>Client Details</h4>
                <input style={inputStyle} placeholder="Client Name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
                <input style={inputStyle} placeholder="Company" value={client.company} onChange={(e) => setClient({ ...client, company: e.target.value })} />
                <input style={inputStyle} placeholder="Phone" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
                <input style={inputStyle} placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
              </div>
            )}

            <div style={sectionStyle}>
              <h4>Payment Details</h4>
              <input type="number" style={inputStyle} placeholder="Paid Amount" value={payment.paid_amount} onChange={(e) => setPayment({ ...payment, paid_amount: e.target.value })} />
              <input type="number" style={inputStyle} placeholder="Balance Amount" value={payment.balance_amount} disabled />
              <input type="date" style={inputStyle} value={payment.payment_date} onChange={(e) => setPayment({ ...payment, payment_date: e.target.value })} />
              <input style={inputStyle} placeholder="Payment Method" value={payment.payment_method} onChange={(e) => setPayment({ ...payment, payment_method: e.target.value })} />
            </div>
          </div>
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
