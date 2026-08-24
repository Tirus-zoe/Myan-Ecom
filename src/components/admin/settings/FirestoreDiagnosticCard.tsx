import React, { useState } from 'react';
import { Database, Activity, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { testFirestoreConnection, FirestoreTestResult } from '../../../utils/firestoreTester';

interface FirestoreDiagnosticCardProps {
  productsCount: number;
  onSeedToFirestore: () => Promise<{ success: boolean; message: string }>;
}

export const FirestoreDiagnosticCard: React.FC<FirestoreDiagnosticCardProps> = ({
  productsCount,
  onSeedToFirestore,
}) => {
  const [testingDb, setTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<FirestoreTestResult | null>(null);
  const [seedingDb, setSeedingDb] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const runFirestoreTest = async () => {
    setTestingDb(true);
    setTestResult(null);
    try {
      const result = await testFirestoreConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Unexpected test failure',
      });
    } finally {
      setTestingDb(false);
    }
  };

  const handleSeed = async () => {
    setSeedingDb(true);
    setSeedResult(null);
    try {
      const res = await onSeedToFirestore();
      setSeedResult(res);
    } catch (err: any) {
      setSeedResult({
        success: false,
        message: err?.message || 'Failed to sync to Firestore',
      });
    } finally {
      setSeedingDb(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3 bg-gradient-to-br from-emerald-50/40 via-white to-white">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Database size={16} className="text-emerald-700" />
          <span>Firebase Firestore Database Status</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
          authentic-beauty-87
        </span>
      </div>

      <p className="text-gray-600 text-[11px] leading-relaxed">
        Test real-time read and write access to your connected Cloud Firestore database to ensure permissions and configuration are working.
      </p>

      {/* Test Result Message Box */}
      {testResult && (
        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <div className="font-bold text-xs">
              {testResult.success ? 'Database is Working Successfully!' : 'Database Test Failed'}
            </div>
            <p className="text-[11px] leading-snug">{testResult.message}</p>
          </div>
        </div>
      )}

      {/* Seed Result Message Box */}
      {seedResult && (
        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
            seedResult.success
              ? 'bg-sky-50 border-sky-200 text-sky-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {seedResult.success ? (
            <CheckCircle2 size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <div className="font-bold text-xs">
              {seedResult.success ? 'Firestore Sync Complete!' : 'Firestore Sync Failed'}
            </div>
            <p className="text-[11px] leading-snug">{seedResult.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={runFirestoreTest}
          disabled={testingDb || seedingDb}
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition-all"
        >
          {testingDb ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Testing Connection...</span>
            </>
          ) : (
            <>
              <Activity size={15} />
              <span>Test Firestore Read/Write</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSeed}
          disabled={seedingDb || testingDb}
          className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 disabled:bg-sky-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition-all"
        >
          {seedingDb ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Pushing Items to Firestore...</span>
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              <span>Push All Items to Firestore ({productsCount} items)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
