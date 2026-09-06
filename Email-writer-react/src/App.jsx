import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Typography,
  Container,
  Button,
  InputLabel,
  Select,
  TextField
} from '@mui/material';
function App(){
  const[emailContent, setEmailContent] = useState('');
  const[tone, setTone] = useState('');
  const[generatedReply, setGeneratedReply] = useState('');
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState('');
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post('http://localhost:9090/api/email/generate', {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data.reply === 'string' ? response.data : JSON.stringify(response.data));

      if(!response.ok){
        throw new Error('Failed to generate reply');
      }
      const data = await response.json();
      setGeneratedReply(data.reply);
    } 
    catch (error) {
      setError('Failed to Generate the Email reply. please try again later');
      console.error('Error generating reply:', error);
    }
     finally {
      setLoading(false);
    }
  }
  return(
    <Container maxWidth = "md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx = {{mx : 3}}>
        <TextField
          fullWidth
          multiline
          rows = {6}
          label = "Email Content"
          onChange = {(e) => setEmailContent(e.target.value)}
          sx = {{mb : 2}} />
          <FormControl fullWidth sx = {{mb : 2}}>
            <InputLabel id = "tone-label">Tone</InputLabel>
            <Select
              labelId = "tone-label"
              value = {tone}
              label = "Tone"
              onChange = {(e) => setTone(e.target.value)}>
                <MenuItem value = "">None</MenuItem>
                <MenuItem value = "Formal">Formal</MenuItem>
                <MenuItem value = "Informal">Informal</MenuItem>
                <MenuItem value = "Friendly">Friendly</MenuItem>
                <MenuItem value = "Professional">Professional</MenuItem>
                <MenuItem value = "Casual">Casual</MenuItem>
              </Select>
            
          </FormControl>
          <Button
            variant = "contained"
            onClick = {handleSubmit}
            disabled = {loading || !emailContent || !tone}
            fullWidth
            sx = {{py : 1.5, mb : 2}}>
            {loading ? <CircularProgress size = {24} /> : 'Generate Reply'}
          </Button> 
      </Box>
      {error && (
        <Typography color = "error" sx = {{mx : 3, mb : 2}}>
          {error}
        </Typography>
      )}
      {generatedReply && (
        <Box sx = {{mx : 3, mt : 2}}>
          <Typography variant = "h6" gutterBottom>
            Generated Reply:
          </Typography>
         <TextField
              fullWidth
              multiline
              rows={8}
              value={generatedReply.replace(/\\n/g, '\n')}
              InputProps={{
                readOnly: true,
              }}
            />
          <Button 
            variant = "outlined"
            onClick = {() => navigator.clipboard.writeText(generatedReply)}
            sx = {{mt : 2}}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}
export default App;