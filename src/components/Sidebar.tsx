import React from 'react';

interface SidebarProps {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, setSelectedSection }) => {
  return (
    <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
      <h3>Update Profile</h3>
      <ul className="list-unstyled">
        <li 
          onClick={() => setSelectedSection('account')} 
          style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSection === 'account' ? '#f0f0f0' : '' }}
        >
          Account Details
        </li>
        <li 
          onClick={() => setSelectedSection('password')} 
          style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSection === 'password' ? '#f0f0f0' : '' }}
        >
          Change Password
        </li>
        <li 
          onClick={() => setSelectedSection('projects')} 
          style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSection === 'projects' ? '#f0f0f0' : '' }}
        >
          Update Projects
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
