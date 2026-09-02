function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <p className="text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Ramayana Journey. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer