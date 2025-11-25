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
    </div>
  )
}

export default Navbar
