import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useRef, useState } from "react";
import background from "../assets/backgroundREG.png";
import { registerModel } from "../model/registerModel";
import { signUp } from "../service/service";
import { convertImagetoURL } from "../service/uploadImage";
import MainPage from "./main";
function ResignterPage() {
  const nameRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  //   const RepasswordRef = useRef<HTMLInputElement>();
  
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("null");
  // const [imageFile, setImageFile] = useState(null);
  // const [imageFileRef, setImageFileRef] = useState(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Assuming setImageFileRef is actually meant to be a state setter and not a ref:
  const [imageFileRef, setImageFileRef] = useState<File | null>(null);

  const [error, seterror] = useState(false);
  const [texterror, settexterror] = useState("");
  
  const PaperI = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,

    height: "100%",
    // lineHeight: "100px",
    padding: 20,
  }));

  const handleClose = () => {
    setOpen(false);
  };

  //   const Transition = React.forwardRef(function Transition(
  //     props: TransitionProps & {
  //       children: React.ReactElement<never, never>;
  //     },
  //     ref: React.Ref<unknown>
  //   ) {
  //     return <Slide direction="up" ref={ref} {...props} />;
  //   });

  const textfromreg = () => {
    return (
      <Box sx={{ padding: 1 }}>
        <TextField
          inputRef={nameRef}
          id="outlined-basic"
          label="name"
          variant="outlined"
          fullWidth
          sx={{ margin: 1 }}
          //   InputProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
          //   InputLabelProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
        />
        <TextField
          inputRef={emailRef}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ margin: 1 }}
          //   InputProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
          //   InputLabelProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
        />
        <TextField
          inputRef={usernameRef}
          id="outlined-basic"
          label="username"
          variant="outlined"
          fullWidth
          sx={{ margin: 1 }}
          //   InputProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
          //   InputLabelProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
        />
        <TextField
          inputRef={passwordRef}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          fullWidth
          sx={{ margin: 1 }}
          //   InputProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
          //   InputLabelProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
        />
        {/* <TextField
          inputRef={RepasswordRef}
          id="outlined-basic"
          label="ConfirmPassword"
          variant="outlined"
          fullWidth
          sx={{ margin: 1 }}
          //   InputProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
          //   InputLabelProps={{
          //     style: { fontFamily: "Mitr" },
          //   }}
        /> */}
      </Box>
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFileRef(file);
      setProfileImageUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const userData: registerModel = {
        username: usernameRef.current?.value || "",
        password: passwordRef.current?.value || "",
        email: emailRef.current?.value || "",
        aka: nameRef.current?.value || "",
        image_profile: "",
      };

      const response = await convertImagetoURL(imageFileRef);

      if (response.status) {
        userData.image_profile = response.url;
        console.log(userData);

        const res = await signUp(userData);

        if ((await res).status) {
          console.log("S" + (await res).status);
        }

        setLoading(false);
        setOpen(true);
      } else {
        setLoading(false);
        setOpen(true);
        seterror(true);
        settexterror("กรุณากรอกข้อมูลให้ครบ");

        console.error(
          "Image upload failed:"
          //   response.data.status,
          //   response.data.data.error
        );
      }
    } catch (error) {
      setLoading(false);
      setOpen(true);
      seterror(true);
      settexterror(error + "");
      console.error("Error during registration:", error);
    }
  };

  const componentupload = () => {
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {imageFile ? (
            <Avatar
              alt="Profile Picture"
              src={profileImageUrl}
              sx={{
                maxWidth: 300,
                maxHeight: 300,
                width: 200,
                height: 200,
                mt: 2,
              }}
            />
          ) : (
            <Avatar
              alt="Profile Picture"
              src={profileImageUrl}
              sx={{
                maxWidth: 300,
                maxHeight: 300,
                width: 200,
                height: 200,
                mt: 2,
              }}
            />
          )}
        </Box>
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          <p style={{ margin: 0, marginRight: 10 }}>Upload</p>
          <CloudUploadIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
    );
  };

  return (
    <Box
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        objectFit: "cover",
        overflow: "hidden",
      }}
    >
      <Container fixed>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} sx={{ marginTop: "15vh" }}>
            <PaperI elevation={10}>
              {" "}
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: "Kanit" }}
              >
                Register
              </Typography>
              <Grid item container justifyContent="center">
                <Grid item xs={12} md={6} lg={6}>
                  {textfromreg()}
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  {componentupload()}
                </Grid>
              </Grid>
              <Button
                type="submit"
                color="success"
                variant="outlined"
                onClick={handleRegister}
                sx={{ mt: 3 }}
              >
                Register
              </Button>
            </PaperI>
          </Grid>
        </Grid>

        <Dialog
          open={open}
          TransitionComponent={MainPage}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle sx={{ color: error ? "red" : "green" }}>
            {error ? "Not Success" : "Success Signup"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {error
                ? texterror + ""
                : //   "There was an error during signup. Please try again."
                  "You have successfully registered. Please go back to the login page."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Box>
  );
}

export default ResignterPage;
