import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getUserProfileAPI } from "../../api's/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const Dashboard = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });
  console.log("data", data);
  const temDate = data?.user?.nextBillingDate
    ? new Date(data?.user?.nextBillingDate).toDateString()
    : "No Billing Date";
  const temDate2 = data?.user?.trialExpires
    ? new Date(data?.user?.trialExpires).toDateString()
    : "NA";
  const name = data?.user?.username;
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading..." />;
  }
  if (isError) {
    return (
      <StatusMessage type="error" message={error?.response?.data?.message} />
    );
  }
  return (
    <div className="mx-auto p-4 bg-gray-900 w-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Name
              </label>
              <p
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                id="username"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <p
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                id="email"
              >
                {data?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Usage Section */}
        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Credit Usage</h2>
          <div>
            <p className="mb-4">
              Monthly Credit: {data?.user?.monthlyRequestCount}
            </p>
            <p className="mb-4">Credit Used: {data?.user?.apiRequestCount}</p>
            <p className="mb-4">
              Credit Remaining:{" "}
              {data?.user?.monthlyRequestCount - data?.user?.apiRequestCount}
            </p>
            <p className="mb-4">Next Billing Date: {temDate}</p>
          </div>
        </div>

        {/* Payment and Plans Section */}
        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment & Plans</h2>
          <div>
            <p className="mb-4">Current Plan: {data?.user?.subscriptionPlan}</p>
            {data?.user?.subscriptionPlan === "Trial" && (
              <p className="border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4">
                Trial : 100 monthly requests
              </p>
            )}
            {data?.user?.subscriptionPlan === "Free" && (
              <p className="border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4">
                Free : 5 monthly requests
              </p>
            )}
            {data?.user?.subscriptionPlan === "Basic" && (
              <p className="border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4">
                Basic : 50 monthly requests
              </p>
            )}
            {data?.user?.subscriptionPlan === "Premium" && (
              <p className="border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4">
                Premium : 100 monthly requests
              </p>
            )}
            <Link
              to="/plans"
              className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Trial Information Section */}
        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Trial Information</h2>
          <div>
            <p className="mb-4">
              Trial Status:{" "}
              {data?.user?.trialActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-yellow-600">Inactive</span>
              )}
            </p>
            <p className="mb-4">Expires on: {temDate2}</p>
            <Link
              to="/plans"
              className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>

        {/* History Section */}
        <div className="mb-6 bg-white p-4 shadow rounded-lg col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Payment History
          </h2>
          {data?.user?.payment?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {/* Example History Item */}
              {data?.user?.payments?.map((payment) => {
                return (
                  <li className="py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-sm font-medium text-indigo-600">
                          {payment?.subscriptionPlan}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment?.createdAt).toDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p
                          className={`text-sm font-semibold ${
                            payment?.status === "succeeded"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {payment.status}
                        </p>
                        <p className="text-sm text-gray-700 ml-4">
                          ${payment.amount}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <h1>No Payment History Yet.</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
