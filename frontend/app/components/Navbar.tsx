import Link from "next/link";

const Navbar = () => {
  return (
    <div>
    <br></br>
        <Link href="/Mainpage">
        Mainpage
        </Link>

        <br></br>
        <Link href="/profile">
        Profile
        </Link>
        <br></br>
        <Link href="/Signup">
        signup page
        </Link>
        <br></br>
        <Link href="/Login">
        login page
        </Link>
        <br></br>
        <Link href="/profile">
        Profile
        </Link>
        <Link href="/Community">
        community page
        </Link>

    </div>
  )
}

export default Navbar
