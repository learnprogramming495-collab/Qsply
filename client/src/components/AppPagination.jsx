import React from 'react';
import { Pagination, Box } from '@mui/material';

const AppPagination = ({ count, page, onChange }) => {
  // The MUI Pagination component expects a numeric count.
  // If count is 0 or null, we shouldn't render anything.
  if (count <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default AppPagination;
