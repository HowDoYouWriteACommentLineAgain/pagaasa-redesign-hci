
function Navigation(){
  return (
    <header className="bg-dark-azure flex flex-wrap md:flex-nowrap justify-end items-e px-5 py-4 z-50">
      <div id="logo_section" className="me-5 flex flex-row items-center gap-5">
        <img src="images/logo.png" width={70} alt="PAGASA LOGO" className="shrink-0 pe-5"/>
        <div className="text-white">
          <h3 className=" font-extralight md:text-[12px] leading-tight max-w-60">Department of Science and Technology</h3>
          <h2 className=" font-bold text-2xl leading-none">PAGASA</h2>
        </div>
      </div> 
      <div id="links" className="flex flex-wrap+- md:items-center lg:justify-end-safe text-white text-sm md:text-xl font-light md:mt-0">
        <a href="#" className="px-3 py-1 hover:opacity-80" >HOME</a>
        <a href="#" className="px-3 py-1 hover:opacity-80" >FORECAST</a>
        <a href="#" className="px-3 py-1 hover:opacity-80" >ASTRONOMY</a>
        <a href="#" className="px-3 py-1 hover:opacity-80" >ADVISORY</a>
        <a href="#" className="px-3 py-1 hover:opacity-80" >BULLETIN</a>
      </div>
    </header>
  )
}

export default Navigation;