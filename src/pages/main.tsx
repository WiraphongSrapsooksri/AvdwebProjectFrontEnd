import { Container } from "@mui/system";
import background from "../assets/backgroundREG.png";
function MainPage (){
    return (
        <Container sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            minWidth: "100vw",
            objectFit: "cover",
            overflow: "hidden",
        }}>
            
        </Container>
    )
}

export default MainPage;