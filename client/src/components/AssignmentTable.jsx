// AssignmentTable.jsx

import React, { useEffect, useState, useCallback } from 'react';

export default function AssignmentTable() {
  const [assignments, setAssignments] = useState([]);
  const [sortKey, setSortKey] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const fetchData = useCallback(() => {
    fetch('http://localhost:5000/api/project_assignments')
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error('❌ Error fetching data:', err));
  }, []);

  useEffect(() => {
    fetchData(); // första hämtningen
    const interval = setInterval(fetchData, 60000); // uppdatering var 60:e sekund
    return () => clearInterval(interval); // rensa vid unmount
  }, [fetchData]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    let aVal, bVal;

    switch (sortKey) {
      case 'employee_id':
        aVal = a.employee_id?.full_name || '';
        bVal = b.employee_id?.full_name || '';
        break;
      case 'project_code':
        aVal = a.project_code?.project_name || '';
        bVal = b.project_code?.project_name || '';
        break;
      case 'start_date':
      default:
        aVal = new Date(a.start_date);
        bVal = new Date(b.start_date);
        break;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const latestFive = sortedAssignments.slice(0, 5);

  const renderHeader = (label, key) => (
    <th
      onClick={() => handleSort(key)}
      className="text-left py-3 px-4 cursor-pointer hover:underline whitespace-nowrap"
    >
      <div className="flex items-center gap-1 min-w-[140px]">
        <span>{label}</span>
        <span className="text-xs w-3 text-right">
          {sortKey === key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </span>
      </div>
    </th>
  );
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              {renderHeader('Employee', 'employee_id')}
              {renderHeader('Project', 'project_code')}
              {renderHeader('Start Date', 'start_date')}
            </tr>
          </thead>
          <tbody>
            {latestFive.map((assignment, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{assignment.employee_id?.full_name || 'N/A'}</td>
                <td className="py-2 px-4">{assignment.project_code?.project_name || 'N/A'}</td>
                <td className="py-2 px-4">{new Date(assignment.start_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
