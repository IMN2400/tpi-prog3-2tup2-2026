import Banner from "./banner/Banner"
import NavBar from "./navbar/NavBar"


const Header = () => {
    const SpacerStyle = {
        paddingBottom: "200px",
    }
    return <>
    <section className="fixed-top">
        <Banner />
        <NavBar />
    </section>
    <section style={SpacerStyle} />
    </>
}

export default Header