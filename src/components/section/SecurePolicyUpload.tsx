import React, { useRef, ChangeEvent } from 'react';
import { Button, Box } from '@mui/material';

interface SecurePolicyUploadProps {
  onFileSelect: (file: File) => void;
}

const SecurePolicyUpload: React.FC<SecurePolicyUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file input click to simulate click on the hidden input element
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and pass the file to the parent component or function
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      onFileSelect(file); // Call the passed function with the selected file
    }
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input element
        onChange={handleFileChange}
      />
      <Button variant="contained" sx={{ mt: 3 }} style={{ color: 'black', background: 'white', fontSize: '20px', borderRadius: '37px' }} onClick={handleButtonClick}>
        Secure Policy Upload
      </Button>
    </Box>
  );
};

export default SecurePolicyUpload;
