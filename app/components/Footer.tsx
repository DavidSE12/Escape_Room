// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full text-center p-4 mt-8 border-t">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </p>
    </footer>
  );
}
