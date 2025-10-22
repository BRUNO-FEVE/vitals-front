import {
  StoredPatientData,
  PatientStorage,
  TriageResult,
} from "@/types/patient";

// Global storage for patient data
// In a production environment, this would be replaced with a database
const globalStorage: PatientStorage = new Map();

class PatientStorageService {
  private storage: PatientStorage = globalStorage;
  private readonly MAX_STORAGE_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Store patient data in memory
   * @param hospitalPassword - The hospital password used as the key
   * @param patientData - The patient data to store
   */
  storePatient(
    hospitalPassword: string,
    patientData: Omit<StoredPatientData, "hospitalPassword" | "createdAt">
  ): void {
    console.log(this.storage);

    const dataToStore: StoredPatientData = {
      ...patientData,
      hospitalPassword,
      createdAt: Date.now(),
    };

    this.storage.set(hospitalPassword, dataToStore);
    console.log(
      `Patient data stored for hospital password: ${hospitalPassword}`
    );
  }

  /**
   * Retrieve patient data by hospital password
   * @param hospitalPassword - The hospital password to look up
   * @returns The stored patient data or null if not found
   */
  getPatient(hospitalPassword: string): StoredPatientData | null {
    console.log("Storage contents:", Array.from(this.storage.keys()));
    console.log("Looking for hospital password:", hospitalPassword);

    const patientData = this.storage.get(hospitalPassword);

    if (!patientData) {
      return null;
    }

    // Check if data has expired
    if (this.isExpired(patientData.createdAt)) {
      this.storage.delete(hospitalPassword);
      console.log(
        `Patient data expired and removed for hospital password: ${hospitalPassword}`
      );
      return null;
    }

    return patientData;
  }

  /**
   * Remove patient data from storage
   * @param hospitalPassword - The hospital password to remove
   */
  removePatient(hospitalPassword: string): boolean {
    return this.storage.delete(hospitalPassword);
  }

  /**
   * Check if stored data has expired
   * @param createdAt - The creation timestamp
   * @returns True if the data has expired
   */
  private isExpired(createdAt: number): boolean {
    return Date.now() - createdAt > this.MAX_STORAGE_AGE;
  }

  /**
   * Clean up expired entries
   */
  cleanupExpired(): void {
    const now = Date.now();
    for (const [key, data] of this.storage.entries()) {
      if (now - data.createdAt > this.MAX_STORAGE_AGE) {
        this.storage.delete(key);
        console.log(
          `Cleaned up expired patient data for hospital password: ${key}`
        );
      }
    }
  }

  /**
   * Get the number of stored patients
   * @returns The number of patients currently stored
   */
  getStorageSize(): number {
    return this.storage.size;
  }

  /**
   * Send triage results to the hospital's callback URL
   * @param returnUrl - The hospital's callback URL
   * @param triageResult - The triage results to send
   */
  async sendTriageResults(
    returnUrl: string,
    triageResult: TriageResult
  ): Promise<boolean> {
    try {
      const response = await fetch(returnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(triageResult),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Triage results sent successfully to: ${returnUrl}`);
      return true;
    } catch (error) {
      console.error(`Failed to send triage results to ${returnUrl}:`, error);
      return false;
    }
  }
}

// Export a singleton instance
export const patientStorage = new PatientStorageService();

// Clean up expired entries every hour
setInterval(() => {
  patientStorage.cleanupExpired();
}, 60 * 60 * 1000);
