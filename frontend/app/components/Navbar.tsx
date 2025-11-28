import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/Mainpage" className="text-2xl font-bold text-orange-600 hover:text-orange-700">
          RedditClone
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/Mainpage" className="text-gray-700 hover:text-orange-600 font-medium transition">
            Home
          </Link>

          <Link href="/Community" className="text-gray-700 hover:text-orange-600 font-medium transition">
            Communities
          </Link>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-3 ml-8">
            <Link
              href="/Login"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              Login
            </Link>
            <Link
              href="/Signup"
              className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;