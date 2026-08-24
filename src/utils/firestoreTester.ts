import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface FirestoreTestResult {
  success: boolean;
  message: string;
  details?: {
    writeLatencyMs?: number;
    readLatencyMs?: number;
    docId?: string;
    readDocCount?: number;
    error?: string;
    projectId?: string;
  };
}

/**
 * Performs an end-to-end verification of the Firestore database:
 * 1. Checks connection to the configured Firebase instance
 * 2. Writes a test document to '_connection_tests'
 * 3. Reads the written document back
 * 4. Cleans up the test document
 */
export async function testFirestoreConnection(): Promise<FirestoreTestResult> {
  const startTime = Date.now();
  let testDocRefId = '';

  try {
    const testCollection = collection(db, '_connection_tests');
    
    // 1. Test Write
    const writeStart = Date.now();
    const docRef = await addDoc(testCollection, {
      testMessage: 'Testing Firestore Connection',
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      createdFrom: 'SmartCatalog Admin Diagnostic',
    });
    const writeLatencyMs = Date.now() - writeStart;
    testDocRefId = docRef.id;

    // 2. Test Read
    const readStart = Date.now();
    const querySnapshot = await getDocs(testCollection);
    const readLatencyMs = Date.now() - readStart;

    // 3. Clean up test document
    try {
      await deleteDoc(doc(db, '_connection_tests', testDocRefId));
    } catch {
      // Cleanup error is non-fatal
    }

    return {
      success: true,
      message: 'Firestore is fully functional & connected! (Read/Write OK)',
      details: {
        writeLatencyMs,
        readLatencyMs,
        docId: testDocRefId,
        readDocCount: querySnapshot.size,
        projectId: 'authentic-beauty-87',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Firestore connection failed',
      details: {
        error: error?.code ? `[${error.code}] ${error.message}` : String(error),
        projectId: 'authentic-beauty-87',
      },
    };
  }
}
