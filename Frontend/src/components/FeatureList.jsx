import { FaCog, FaTools, FaThumbsUp, FaMagic } from "react-icons/fa";

const features = [
  {
    icon: <FaCog size={22} className="text-gray-600" />,
    title: "Adaptable performance",
    description:
      "Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.",
  },
  {
    icon: <FaTools size={22} className="text-gray-600" />,
    title: "Built to last",
    description:
      "Experience unmatched durability that goes above and beyond with lasting investment.",
  },
  {
    icon: <FaThumbsUp size={22} className="text-gray-600" />,
    title: "Great user experience",
    description:
      "Integrate our product into your routine with an intuitive and easy-to-use interface.",
  },
  {
    icon: <FaMagic size={22} className="text-gray-600" />,
    title: "Innovative functionality",
    description:
      "Stay ahead with features that set new standards, addressing your evolving needs better than the rest.",
  },
];

export default function FeatureList() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      {features.map((item, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div>{item.icon}</div>
          <div>
            <h4 className="font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
