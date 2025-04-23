import React, { useEffect, useState } from 'react';

interface SidebarProps {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, setSelectedSection }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Customize breakpoint as needed
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarStyle: React.CSSProperties = {
    position: isMobile ? 'relative' : 'fixed',
    top: isMobile ? '0' : '60px', 
    left: 0,
    bottom: isMobile ? 'auto' : 0,
    width: isMobile ? '100%' : '250px',
    // borderRight: isMobile ? 'none' : '1px solid #0056b3',
    backgroundColor: '#4A90E2', 
    color: '#fff',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 1000,
  };

  const itemStyle = (section: string): React.CSSProperties => ({
    cursor: 'pointer',
    padding: '10px',
    backgroundColor: selectedSection === section ? '#0056b3' : 'transparent',
    borderRadius: '4px',
  });

  return (
    <div style={sidebarStyle}>
      <h3 style={{ color: '#fff' }}>Update Profile</h3>
      <ul className="list-unstyled" style={{ padding: 0, margin: 0 }}>
        <li onClick={() => setSelectedSection('account')} style={itemStyle('account')}>
          Account Details
        </li>
        <li onClick={() => setSelectedSection('password')} style={itemStyle('password')}>
          Change Credentials
        </li>
        <li onClick={() => setSelectedSection('projects')} style={itemStyle('projects')}>
          Update Experience
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
