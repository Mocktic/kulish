'use client';

import { useState, useEffect } from "react";
import { DataTable } from '@/components/ui/data-table';

interface AdmissionEnquiry {
  id: string;
  studentName: string;
//   parentName: string;
  email: string;
  phone: string;
  gradeApplying: string;
  currentSchool: string;
  message: string;
  submittedAt: string;
  // Original fields from form
  firstName: string;
  middleName?: string;
  lastName: string;
  academicYear: string;
  selectedClass: string;
  bookCounseling?: string;
  [key: string]: any; // For any additional fields
}

export default function AdmissionsTable() {
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(
    null
  );
  const [admissionEnquiries, setAdmissionEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/admissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch admission enquiries');
        }
        const data = await response.json();
        setAdmissionEnquiries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const columns = [
    { header: 'Student Name', accessor: 'studentName' as keyof AdmissionEnquiry },
    { header: 'Phone', accessor: 'phone' as keyof AdmissionEnquiry },
    { header: 'Grade Applying', accessor: 'gradeApplying' as keyof AdmissionEnquiry },
    { 
      header: 'Counseling',
      accessor: 'bookCounseling' as keyof AdmissionEnquiry,
      render: (value: string | undefined) => value || 'Not requested',
    },
    {
      header: 'Submitted',
      accessor: 'submittedAt' as keyof AdmissionEnquiry,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div>
      <DataTable
        data={admissionEnquiries}
        columns={columns}
        onRowClick={setSelectedEnquiry}
      />

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Admission Enquiry Details</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Student Name</h4>
                  <p>{selectedEnquiry.studentName}</p>
                </div>
                {/* <div>
                  <h4 className="font-semibold">Parent Name</h4>
                  <p>{selectedEnquiry.parentName}</p>
                </div> */}
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p>{selectedEnquiry.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p>{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Academic Year</h4>
                  <p>{selectedEnquiry.academicYear}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Class Applying For</h4>
                  <p>{selectedEnquiry.selectedClass}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Current School</h4>
                  <p>{selectedEnquiry.currentSchool}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Counseling Requested</h4>
                  <p>{selectedEnquiry.bookCounseling || 'No'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Submitted At</h4>
                  <p>{new Date(selectedEnquiry.submittedAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedEnquiry.message && (
                <div>
                  <h4 className="font-semibold">Message</h4>
                  <p className="whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 