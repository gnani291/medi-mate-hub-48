
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getPatientHistory } from '@/lib/db';

interface PatientHistory {
  id: string;
  username: string;
  phoneNumber: string;
  medicineType: string;
  dispensedAt: Date;
}

const PatientHistoryTable = () => {
  const [patients, setPatients] = useState<PatientHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const history = await getPatientHistory();
        setPatients(history);
      } catch (error) {
        console.error("Error fetching patient history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientHistory();
  }, []);

  const getMedicineTypeLabel = (type: string) => {
    switch (type) {
      case 'fever': return 'Fever';
      case 'cough': return 'Cough';
      case 'cold': return 'Cold';
      case 'stomachAche': return 'Stomach Ache';
      default: return type;
    }
  };

  return (
    <div className="w-full overflow-hidden shadow-sm rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-medimate-gray border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading patient data...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No patient history available
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.medicineType === 'fever' ? 'bg-rose-100 text-rose-800' :
                      patient.medicineType === 'cough' ? 'bg-amber-100 text-amber-800' :
                      patient.medicineType === 'cold' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {getMedicineTypeLabel(patient.medicineType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(patient.dispensedAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(patient.dispensedAt), 'hh:mm a')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistoryTable;
