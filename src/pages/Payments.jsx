// src/pages/Payments.jsx
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

export default function Payments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const res = await getProjects(); // fetch projects from backend
        const projects = res.data;

        const pending = projects.flatMap((project) =>
          (project.payments || [])
            .filter((p) => p.payment_status === "PENDING")
            .map((p) => ({
              projectId: project.id,
              projectTitle: project.title,
              totalFee: project.total_fee,
              paidAmount: p.paid_amount,
              balanceAmount: p.balance_amount,
              paymentDate: p.payment_date,
              paymentMethod: p.payment_method,
              status: p.payment_status,
              // Add name & phone
              contactName:
                project.project_type === "STUDENT"
                  ? project.students?.map((s) => s.name).join(", ")
                  : project.client?.name,
              contactPhone:
                project.project_type === "STUDENT"
                  ? project.students?.map((s) => s.phone).join(", ")
                  : project.client?.phone,
            }))
        );

        setPendingPayments(pending);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading pending payments...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pending Payments</h1>

      {pendingPayments.length === 0 ? (
        <p>No pending payments 🎉</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>Project ID</th>
              <th>Project Title</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Total Fee</th>
              <th>Paid Amount</th>
              <th>Balance Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {pendingPayments.map((p, index) => (
              <tr key={index}>
                <td>{p.projectId}</td>
                <td>{p.projectTitle}</td>
                <td>{p.contactName || "-"}</td>
                <td>{p.contactPhone || "-"}</td>
                <td>{p.totalFee}</td>
                <td>{p.paidAmount}</td>
                <td>{p.balanceAmount}</td>
                <td>{p.paymentDate || "-"}</td>
                <td>{p.paymentMethod || "-"}</td>
                <td style={{ color: "red", fontWeight: "bold" }}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
