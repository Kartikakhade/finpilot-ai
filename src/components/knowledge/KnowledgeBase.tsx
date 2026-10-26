import { useState, useEffect } from 'react';
import {
  Upload,
  Zap,
  FileText,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { api } from '../../services/api';
import type { DocumentMetadata } from '../../types';

export function KnowledgeBase() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [company, setCompany] = useState('');
  const [year, setYear] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsSeedingDemo(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const res = await api.loadDemoData();
      setUploadSuccess(`Seeded demo reports: ${res.message} (${res.count} filings ready).`);
      await fetchDocuments();
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || err.message || 'Failed to seed demo reports.');
    } finally {
      setIsSeedingDemo(false);
    }
  };

  const handleUploadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !company.trim() || !year.trim()) {
      setUploadError('Please select a PDF file, enter company name and fiscal year.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await api.ingestDocument(selectedFile, company.trim(), year.trim());
      setUploadSuccess(`Ingested ${res.company} FY${res.year}: ${res.chunks_created} vector chunks embedded.`);
      setSelectedFile(null);
      setCompany('');
      setYear('');
      await fetchDocuments();
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || err.message || 'PDF ingestion failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.year.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.source.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#161b2b] border border-[#273247] text-[11px] text-[#57f1db] font-mono mb-1.5">
            <CheckCircle2 size={11} />
            <span>ChromaDB Vector Retrieval Store</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#dee1f9]">
            Financial Knowledge Base
          </h1>
          <p className="text-xs text-[#bacac5] mt-0.5">
            Institutional document store for semantic 10-K search, ratio extraction, and grounding.
          </p>
        </div>

        {/* Demo Data Seeder */}
        <button
          onClick={handleLoadDemo}
          disabled={isSeedingDemo}
          className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#57f1db] text-[#00201c] text-xs font-semibold flex items-center gap-2 transition disabled:opacity-40 self-start md:self-auto cursor-pointer shadow-sm"
        >
          {isSeedingDemo ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          <span>{isSeedingDemo ? 'Seeding Reports...' : 'Load Demo Reports (AAPL, MSFT, TSLA)'}</span>
        </button>
      </div>

      {/* Notifications */}
      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-[#57f1db] text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: PDF Ingestion Form */}
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <h2 className="font-manrope text-sm font-semibold text-[#dee1f9]">
              Ingest SEC 10-K Filing
            </h2>
          </div>
          <p className="text-xs text-[#bacac5] leading-relaxed">
            Upload institutional annual reports in PDF format. Text is extracted, chunked, and vectorized 
            with sentence transformers into ChromaDB.
          </p>

          <form onSubmit={handleUploadPDF} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#bacac5]/70 mb-1">
                Company Name / Ticker
              </label>
              <input
                type="text"
                placeholder="e.g. Apple Inc. or AAPL"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080d1d] border border-[#273247] text-xs text-white placeholder-[#bacac5]/40 focus:outline-none focus:border-[#57f1db]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#bacac5]/70 mb-1">
                Fiscal Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080d1d] border border-[#273247] text-xs text-white placeholder-[#bacac5]/40 focus:outline-none focus:border-[#57f1db]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#bacac5]/70 mb-1">
                PDF Document File
              </label>
              <div className="border border-dashed border-[#273247] hover:border-[#57f1db]/60 rounded-xl p-4 text-center cursor-pointer transition bg-[#080d1d]">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer block">
                  <FileText size={20} className="mx-auto mb-1 text-[#bacac5]/60" />
                  <span className="text-xs text-[#57f1db] font-medium block">
                    {selectedFile ? selectedFile.name : 'Select PDF File'}
                  </span>
                  <span className="text-[10px] text-[#bacac5]/50 mt-0.5 block">
                    Supported: SEC Form 10-K, 10-Q, 8-K
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full py-2 px-4 rounded bg-[#2dd4bf] hover:bg-[#57f1db] text-[#00201c] text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40 shadow-sm cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Ingesting Filing into ChromaDB...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Upload & Vectorize</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Indexed Benchmarks Table */}
        <div className="lg:col-span-2 rounded-xl bg-[#121a2b] border border-[#273247] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-manrope text-sm font-semibold text-[#dee1f9]">
                  Pre-Indexed Benchmark Reports
                </h2>
                <p className="text-xs text-[#bacac5] mt-0.5">
                  Audited institutional reports available for real-time vector retrieval
                </p>
              </div>

              {/* Search filter input */}
              <div className="relative w-64">
                <Search size={14} className="absolute left-2.5 top-2.5 text-[#bacac5]/60" />
                <input
                  type="text"
                  placeholder="Filter by company or year..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-[#080d1d] border border-[#273247] text-xs text-white placeholder-[#bacac5]/40 focus:outline-none focus:border-[#57f1db]"
                />
              </div>
            </div>

            {/* Document Table */}
            <div className="rounded-lg bg-[#080d1d] border border-[#273247]/50 overflow-hidden">
              <div className="grid grid-cols-12 px-4 py-2.5 bg-[#161b2b] text-[#bacac5] text-[10px] font-bold uppercase tracking-wider">
                <span className="col-span-4">Company Entity</span>
                <span className="col-span-2">Fiscal Year</span>
                <span className="col-span-4">Source Archive</span>
                <span className="col-span-2 text-right">Status</span>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-[#bacac5]/60 flex flex-col items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-[#57f1db] mb-2" />
                  <p>Fetching indexed filings...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#bacac5]/60">
                  <FileText size={24} className="mx-auto mb-2 opacity-30" />
                  <p>No filings indexed matching criteria.</p>
                  <p className="text-[11px] text-[#bacac5]/40 mt-0.5">Click "Load Demo Reports" above.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#273247]/30 max-h-96 overflow-y-auto">
                  {filteredDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 px-4 py-3 items-center hover:bg-[#161b2b]/50 transition text-xs"
                    >
                      <div className="col-span-4 flex items-center gap-2 font-medium text-[#dee1f9]">
                        <Building2 size={15} className="text-[#57f1db] shrink-0" />
                        <span className="truncate">{doc.company}</span>
                      </div>
                      <span className="col-span-2 font-mono text-[#bacac5] text-xs">
                        FY{doc.year}
                      </span>
                      <span className="col-span-4 font-mono text-[11px] text-[#bacac5]/70 truncate">
                        {doc.source}
                      </span>
                      <div className="col-span-2 flex justify-end">
                        <span className="px-2 py-0.5 rounded bg-[#2dd4bf]/10 text-[#57f1db] text-[10px] font-mono border border-[#2dd4bf]/20">
                          Indexed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#273247]/40 flex items-center justify-between text-[11px] text-[#bacac5]/70">
            <span>Total indexed documents: {documents.length}</span>
            <span>Embeddings: sentence-transformers/all-MiniLM-L6-v2 (384 dims)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
