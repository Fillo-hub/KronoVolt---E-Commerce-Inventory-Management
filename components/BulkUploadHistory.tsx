"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaFileCsv,
  FaTrashCan,
  FaTriangleExclamation,
} from "react-icons/fa6";

interface BatchHistory {
  id: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  errors?: string[];
}

const BulkUploadHistory = () => {
  const [batches, setBatches] = useState<BatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{
    id: string;
    fileName: string;
  } | null>(null);
  const [deleteProducts, setDeleteProducts] = useState(false);

  useEffect(() => {
    fetchBatchHistory();
  }, []);

  const fetchBatchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/bulk-upload", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        setError("Impossibile caricare lo storico importazioni");
      }
    } catch {
      setError("Errore di rete nel caricamento dello storico");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (batchId: string, fileName: string) => {
    setBatchToDelete({ id: batchId, fileName });
    setDeleteProducts(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;

    setDeletingBatchId(batchToDelete.id);
    setShowDeleteModal(false);

    try {
      const response = await apiClient.delete(
        `/api/bulk-upload/${batchToDelete.id}?deleteProducts=${deleteProducts}`
      );

      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch {}
        }
      }

      if (response.ok) {
        toast.success(
          deleteProducts
            ? "Lotto e prodotti associati eliminati!"
            : "Lotto eliminato dallo storico (prodotti mantenuti)"
        );
        await fetchBatchHistory();
      } else {
        toast.error(
          data?.error || `Impossibile eliminare il lotto (${response.status})`
        );
      }
    } catch {
      toast.error("Errore di rete durante l'eliminazione");
    } finally {
      setDeletingBatchId(null);
      setBatchToDelete(null);
      setDeleteProducts(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <FaCircleCheck className="text-emerald-500 text-xl" />;
      case "FAILED":
        return <FaCircleXmark className="text-rose-500 text-xl" />;
      case "PARTIAL":
        return <FaTriangleExclamation className="text-amber-500 text-xl" />;
      case "PENDING":
        return <FaClock className="text-blue-500 text-xl" />;
      default:
        return <FaFileCsv className="text-slate-500 text-xl" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-sm text-slate-500">
        Caricamento storico importazioni CSV...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-2xs">
        <FaFileCsv className="text-3xl mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-semibold">
          Nessun caricamento CSV effettuato finora
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold text-slate-900">
        Storico Caricamenti CSV ({batches.length})
      </h2>

      {showDeleteModal && batchToDelete && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <FaTriangleExclamation className="text-amber-500 text-2xl" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Elimina Lotto CSV
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Vuoi eliminare il lotto{" "}
              <strong className="text-slate-900">
                {batchToDelete.fileName}
              </strong>
              ?
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteProducts}
                  onChange={(e) => setDeleteProducts(e.target.checked)}
                  className="mt-1 rounded border-amber-300 text-amber-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-900">
                    Elimina anche i prodotti creati da questo file CSV
                  </span>
                  <p className="text-amber-700 mt-1">
                    Attenzione: i prodotti già presenti in ordini clienti non
                    possono essere eliminati.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {deleteProducts ? "Elimina Tutto" : "Elimina Solo Storico"}
              </button>
            </div>
          </div>
        </div>
      )}

      {batches.map((batch) => (
        <div
          key={batch.id}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(batch.status)}
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {batch.fileName}
                </h3>
                <p className="text-xs text-slate-500">
                  Caricato da {batch.uploadedBy} •{" "}
                  {formatDate(batch.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  batch.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700"
                    : batch.status === "FAILED"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {batch.status}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteClick(batch.id, batch.fileName)}
                disabled={deletingBatchId === batch.id}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Elimina lotto"
              >
                <FaTrashCan className="text-sm" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-lg font-black text-slate-800">
                {batch.totalRecords}
              </p>
              <p className="text-[11px] text-slate-500">Totali</p>
            </div>
            <div className="bg-emerald-50/60 rounded-xl p-2.5">
              <p className="text-lg font-black text-emerald-600">
                {batch.successfulRecords}
              </p>
              <p className="text-[11px] text-slate-500">Importati</p>
            </div>
            <div className="bg-rose-50/60 rounded-xl p-2.5">
              <p className="text-lg font-black text-rose-600">
                {batch.failedRecords}
              </p>
              <p className="text-[11px] text-slate-500">Errori</p>
            </div>
            <div className="bg-blue-50/60 rounded-xl p-2.5">
              <p className="text-lg font-black text-blue-600">
                {batch.totalRecords > 0
                  ? Math.round(
                      (batch.successfulRecords / batch.totalRecords) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-[11px] text-slate-500">Successo</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BulkUploadHistory;
