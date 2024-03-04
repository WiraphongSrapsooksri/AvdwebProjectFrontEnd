import {
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import background from "../assets/backgroundREG2.png";
import logo from "../assets/logo.png";
import { login } from "../service/service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Improved styling for Paper and button
const PaperI = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  padding: 20,
  borderRadius: "10px",
  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
  maxWidth: "400px",
  maxHeight: "600px",
  minHeight: "500px",
}));

const customTheme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const loginResult = await login({
      username: username,
      password: password,
    });
    if (loginResult.status) {
      //   console.log(loginResult.message);
      console.log("Token:", loginResult.token);
      const Token = loginResult.token;
      localStorage.setItem("Token", JSON.stringify(Token));
      //   console.log(JSON.parse(localStorage.getItem("Token")!));
      //   localStorage.setItem("name", nameRef.current!.value);
    } else {
      console.error("Error:", loginResult.message);
    }

    // Clear form data after submission
    setUsername("");
    setPassword("");
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Container
        sx={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          objectFit: "cover",
          overflow: "hidden",
        }}
      >
        {/* Improved layout using Grid component */}

        <Grid container spacing={3} sx={{ paddingTop: 15 }}>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            {/* Center the login form within the Paper */}

            <PaperI elevation={10}>
              <img src={logo} width={"200px"} alt="" />
              <Typography sx={{ paddingTop: 5 }} variant="h5" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  sx={{ marginTop: 4 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              </form>
            </PaperI>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
