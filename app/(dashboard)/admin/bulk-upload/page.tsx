"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import { downloadCsvFile, CsvColumn } from "@/lib/csv";
import {
  FaFileArrowUp,
  FaDownload,
  FaCircleCheck,
  FaCircleXmark,
  FaFileCsv,
  FaTable,
} from "react-icons/fa6";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const CSV_COLUMNS: CsvColumn[] = [
  { header: "title", key: "title" },
  { header: "price", key: "price" },
  { header: "manufacturer", key: "manufacturer" },
  { header: "inStock", key: "inStock" },
  { header: "mainImage", key: "mainImage" },
  { header: "description", key: "description" },
  { header: "slug", key: "slug" },
  { header: "categoryId", key: "categoryId" },
];

const TEMPLATE_ROWS = [
  {
    title: "Galaxy S24 Ultra 5G 512GB",
    price: 1299,
    manufacturer: "Samsung",
    inStock: 1,
    mainImage: "product1.webp",
    description:
      "Smartphone 5G con display Dynamic AMOLED 2X 6.8 pollici 120Hz, telaio in titanio e fotocamera 200MP.",
    slug: "galaxy-s24-ultra-512gb",
    categoryId: "smart-phones",
  },
  {
    title: "Sony WH-1000XM5 ANC Wireless",
    price: 349,
    manufacturer: "Sony",
    inStock: 1,
    mainImage: "product9.webp",
    description:
      "Cuffie over-ear Bluetooth con cancellazione adattiva del rumore a 8 microfoni e 30 ore di autonomia.",
    slug: "sony-wh-1000xm5-anc",
    categoryId: "headphones",
  },
  {
    title: "HP Spectre x360 16 OLED Ultra 7",
    price: 1499,
    manufacturer: "HP",
    inStock: 1,
    mainImage: "product11.webp",
    description:
      "Ultrabook convertibile 2-in-1 con display touchscreen OLED 2.8K 120Hz, 16GB RAM e SSD NVMe 1TB.",
    slug: "hp-spectre-x360-16-oled",
    categoryId: "laptops",
  },
];

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [refreshHistoryKey, setRefreshHistoryKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Seleziona un file con estensione .csv");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Seleziona un file con estensione .csv");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Seleziona prima un file CSV");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiClient.baseUrl}/api/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message:
            data.message || "Prodotti importati/aggiornati con successo!",
          details: data.details || {
            processed: data.total || 0,
            successful: (data.created || 0) + (data.updated || 0),
            failed: data.errors || 0,
            errors: (data.validationErrors || []).map(
              (e: any) => `Riga ${e.index}: ${e.error}`
            ),
          },
        });
        toast.success("Importazione CSV completata!");
        setFile(null);
        setRefreshHistoryKey((k) => k + 1);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Importazione fallita",
          details: data.details,
        });
        toast.error(data.error || "Importazione fallita");
      }
    } catch {
      setUploadResult({
        success: false,
        message: "Errore di rete durante il caricamento del file CSV",
      });
      toast.error("Errore di rete");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    downloadCsvFile("template-prodotti-kronovolt.csv", TEMPLATE_ROWS, CSV_COLUMNS, ";");
    toast.success("Template CSV multi-colonna scaricato!");
  };

  const exportCurrentCatalog = async () => {
    setExporting(true);
    try {
      const res = await apiClient.get("/api/products?mode=admin", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const products = await res.json();
      const rows = (Array.isArray(products) ? products : []).map((p: any) => ({
        title: p.title,
        price: p.price,
        manufacturer: p.manufacturer || "KronoVolt",
        inStock: p.inStock ?? 1,
        mainImage: p.mainImage || "product1.webp",
        description: p.description || "",
        slug: p.slug,
        categoryId: p.category?.name || p.categoryId || "smart-phones",
      }));

      downloadCsvFile(
        `catalogo-prodotti-kronovolt-${new Date().toISOString().slice(0, 10)}.csv`,
        rows,
        CSV_COLUMNS,
        ";"
      );
      toast.success(`Esportati ${rows.length} prodotti in formato CSV multi-colonna!`);
    } catch {
      toast.error("Impossibile esportare il catalogo prodotti");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-slate-50 flex max-w-screen-2xl mx-auto max-xl:flex-col min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-6 sm:p-8 space-y-8">
        {/* Header & Export Actions */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Importazione & Esportazione CSV Prodotti
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              File CSV ottimizzati con codifica UTF-8 BOM e separatore a colonne
              nativo per Microsoft Excel, LibreOffice Calc e Google Sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <FaDownload className="text-blue-600" />
              <span>Scarica Template CSV (8 Colonne)</span>
            </button>

            <button
              type="button"
              onClick={exportCurrentCatalog}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FaFileCsv className="text-sm" />
              <span>
                {exporting
                  ? "Esportazione..."
                  : "Esporta Catalogo Attuale in CSV"}
              </span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50/60"
                : "border-slate-300 bg-slate-50/70 hover:border-blue-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-4">
              <FaFileArrowUp />
            </div>

            <p className="text-base font-bold text-slate-900 mb-1">
              {file ? (
                <span className="text-blue-600">
                  File selezionato: {file.name} ({(file.size / 1024).toFixed(1)}{" "}
                  KB)
                </span>
              ) : (
                "Trascina qui il tuo file CSV oppure clicca per selezionarlo"
              )}
            </p>
            <p className="text-xs text-slate-500 mb-5">
              Supporta sia file CSV salvati da Excel Italia (separatore{" "}
              <code className="font-mono bg-slate-200/70 px-1 rounded">;</code>)
              sia CSV standard (separatore{" "}
              <code className="font-mono bg-slate-200/70 px-1 rounded">,</code>
              ).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Seleziona File .CSV
            </label>
          </div>

          {file && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              {uploading
                ? "Elaborazione e importazione prodotti in corso..."
                : `Avvia Importazione di "${file.name}"`}
            </button>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`rounded-2xl border p-5 ${
                uploadResult.success
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {uploadResult.success ? (
                  <FaCircleCheck className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <FaCircleXmark className="text-2xl text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`text-base font-extrabold ${
                      uploadResult.success
                        ? "text-emerald-900"
                        : "text-rose-900"
                    }`}
                  >
                    {uploadResult.success
                      ? "Importazione Completata"
                      : "Errore Importazione"}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      uploadResult.success
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {uploadResult.message}
                  </p>

                  {uploadResult.details && (
                    <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xl font-black text-slate-900">
                            {uploadResult.details.processed}
                          </p>
                          <p className="text-[11px] font-semibold uppercase text-slate-400">
                            Righe Lette
                          </p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-emerald-600">
                            {uploadResult.details.successful}
                          </p>
                          <p className="text-[11px] font-semibold uppercase text-slate-400">
                            Importate
                          </p>
                        </div>
                        <div>
                          <p className="text-xl font-black text-rose-600">
                            {uploadResult.details.failed}
                          </p>
                          <p className="text-[11px] font-semibold uppercase text-slate-400">
                            Errori
                          </p>
                        </div>
                      </div>

                      {uploadResult.details.errors &&
                        uploadResult.details.errors.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-xs font-bold text-rose-700 mb-1">
                              Dettaglio Errori:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-rose-600 max-h-32 overflow-y-auto">
                              {uploadResult.details.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columns Structure Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4">
            <FaTable className="text-blue-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Struttura Colonne CSV (Ordine Esatto per Excel)
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                  <th className="py-3 px-4">Colonna</th>
                  <th className="py-3 px-4">Obbligatorio</th>
                  <th className="py-3 px-4">Formato</th>
                  <th className="py-3 px-4">Esempio Valido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    title
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">Testo</td>
                  <td className="py-2.5 px-4 text-slate-800">
                    Galaxy S24 Ultra 5G 512GB
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    price
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">Numero (€)</td>
                  <td className="py-2.5 px-4 text-slate-800">1299</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    manufacturer
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">Testo (Brand)</td>
                  <td className="py-2.5 px-4 text-slate-800">Samsung</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    inStock
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">Opzionale</td>
                  <td className="py-2.5 px-4 text-slate-600">
                    1 (Disponibile) / 0 (Esaurito)
                  </td>
                  <td className="py-2.5 px-4 text-slate-800">1</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    mainImage
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">Opzionale</td>
                  <td className="py-2.5 px-4 text-slate-600">
                    Nome file in public/
                  </td>
                  <td className="py-2.5 px-4 text-slate-800">product1.webp</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    description
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">Testo</td>
                  <td className="py-2.5 px-4 text-slate-800">
                    Smartphone 5G con display AMOLED...
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    slug
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">Slug URL</td>
                  <td className="py-2.5 px-4 text-slate-800">
                    galaxy-s24-ultra-512gb
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                    categoryId
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">
                    Sì
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    Nome categoria o UUID
                  </td>
                  <td className="py-2.5 px-4 text-slate-800">
                    smart-phones, laptops, headphones...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload History */}
        <div key={refreshHistoryKey}>
          <BulkUploadHistory />
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
