import { FaHandshake, FaBoxOpen, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaHandshake size={22} className="text-orange-600" />,
    title: "Direct Vendor Connect",
    description:
      "Connect directly with verified suppliers and vendors. Build lasting business relationships with transparent communication and reliable partnerships.",
  },
  {
    icon: <FaBoxOpen size={22} className="text-orange-600" />,
    title: "Sample Before Purchase",
    description:
      "Request samples from suppliers before making bulk orders. Ensure quality and compatibility with your requirements risk-free.",
  },
  {
    icon: <FaMapMarkerAlt size={22} className="text-orange-600" />,
    title: "Local & Global Reach",
    description:
      "Find suppliers near you or expand globally. Location-based search helps you discover the best vendors in your area or worldwide.",
  },
  {
    icon: <FaShieldAlt size={22} className="text-orange-600" />,
    title: "Secure Transactions",
    description:
      "Trade with confidence using our secure platform. Verified vendors, transparent pricing, and protected transactions ensure your business safety.",
  },
];

export default function FeatureList() {
  return (
    <div className="flex flex-col gap-6 max-w-md w-full">
      <div className="md:hidden text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Why Choose VendorVerse?</h3>
        <p className="text-sm text-gray-600">Discover the benefits of our platform</p>
      </div>
      {features.map((item, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-shrink-0">{item.icon}</div>
          <div>
            <h4 className="font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
