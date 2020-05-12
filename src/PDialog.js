import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';

export const PDialog = styled(Dialog)({
    '& .MuiPaper-root:first-of-type' : {
  
      border: 0,
      borderRadius: 9,
      
    }
  });