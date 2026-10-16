"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { AlertCircle, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  amount_raised: number;
  deadline: string;
}

interface Contribution {
  id: string;
  supporter_name: string;
  campaign_title: string;
  amount: number;
  message: string;
}

export default function BuilderHomePage() {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pendingContributions, setPendingContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [campaignsRes, contributionsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns/builder/my-campaigns`, { credentials: "include" }),
        fetch(`${API_URL}/api/contributions/builder/pending`, { credentials: "include" }),
      ]);

      if (!campaignsRes.ok || !contributionsRes.ok) throw new Error("Failed to fetch data");

      const campaignsData = await campaignsRes.json();
      const contributionsData = await contributionsRes.json();

      setCampaigns(campaignsData);
      setPendingContributions(contributionsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`${API_URL}/api/contributions/${action}/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to ${action} contribution`);

      setPendingContributions((prev) => prev.filter((c) => c.id !== id));
      // Toast notification would go here
    } catch (err) {
      alert(`Error: Could not ${action} contribution.`);
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);
  const activeCampaigns = campaigns.filter((c) => new Date(c.deadline) > new Date()).length;

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-950 text-white"><Loader2 className="animate-spin w-10 h-10" /></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-gray-950 text-red-500"><AlertCircle className="w-6 h-6 mr-2" />{error}</div>;

  return (
    <div className="p-8 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Builder Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Campaigns", value: campaigns.length },
          { label: "Active Campaigns", value: activeCampaigns },
          { label: "Total Raised", value: `$${totalRaised.toLocaleString()}` },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Contributions Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-6">Contributions To Review</h2>
        {pendingContributions.length === 0 ? (
          <p className="text-gray-400">No contributions to review right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="pb-4">Supporter</th>
                  <th className="pb-4">Campaign</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingContributions.map((c) => (
                  <tr key={c.id} className="border-b border-gray-800">
                    <td className="py-4">{c.supporter_name}</td>
                    <td className="py-4">{c.campaign_title}</td>
                    <td className="py-4">${c.amount.toLocaleString()}</td>
                    <td className="py-4 flex gap-2">
                      <button onClick={() => setSelectedContribution(c)} className="text-blue-400 hover:text-blue-300"><Eye /></button>
                      <button onClick={() => handleAction(c.id, "approve")} className="text-green-400 hover:text-green-300"><CheckCircle /></button>
                      <button onClick={() => handleAction(c.id, "reject")} className="text-red-400 hover:text-red-300"><XCircle /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Contribution Details</h3>
            <p className="mb-2"><strong>Supporter:</strong> {selectedContribution.supporter_name}</p>
            <p className="mb-2"><strong>Campaign:</strong> {selectedContribution.campaign_title}</p>
            <p className="mb-4"><strong>Message:</strong> {selectedContribution.message}</p>
            <button onClick={() => setSelectedContribution(null)} className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
