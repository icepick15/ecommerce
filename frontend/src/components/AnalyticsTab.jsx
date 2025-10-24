import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "../lib/axios";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("Support for defaultProps") && args[0].includes("Axis")) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("We couldn’t load analytics right now. Please refresh or try again soon.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = useMemo(() => {
    if (!dailySalesData || dailySalesData.length === 0) return [];

    return dailySalesData.map((entry) => {
      const [y, m, d] = (entry.date || "").split("-");
      const parsedDate = y && m && d ? new Date(Date.UTC(Number(y), Number(m) - 1, Number(d))) : new Date();

      return {
        ...entry,
        label: parsedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
      };
    });
  }, [dailySalesData]);

  const metrics = useMemo(() => {
    if (!analyticsData) return [];

    return [
      {
        title: "Total users",
        value: analyticsData.users,
        icon: Users,
        description: "Registered customers",
      },
      {
        title: "Total products",
        value: analyticsData.products,
        icon: Package,
        description: "Active catalog pieces",
      },
      {
        title: "Total sales",
        value: analyticsData.totalSales,
        icon: ShoppingCart,
        description: "Completed orders",
      },
      {
        title: "Total revenue",
        value: analyticsData.totalRevenue,
        icon: DollarSign,
        description: "Lifetime earnings",
        prefix: "₦",
      },
    ];
  }, [analyticsData]);

  return (
    <div className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
      <header className="flex flex-col gap-2 border-b border-black/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Analytics</span>
        <h2 className="text-3xl font-semibold text-gray-900">Performance insights</h2>
        <p className="text-sm text-gray-500">
          A live view of store momentum across customers, products, and revenue. Use this to inform upcoming drops and replenishment.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            className="mt-10 rounded-[28px] border border-red-200 bg-red-50/80 px-6 py-10 text-center text-sm text-red-600 shadow-[0_18px_40px_rgba(248,113,113,0.25)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {error}
          </motion.div>
        ) : (
          <motion.div key="metrics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>

            <motion.div
              className="mt-12 rounded-[32px] border border-black/10 bg-[#f9f7f4] p-6 shadow-[0_24px_55px_rgba(15,23,42,0.08)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="flex flex-col gap-2 pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Revenue & sales</span>
                <h3 className="text-2xl font-semibold text-gray-900">Daily performance overview</h3>
                <p className="text-sm text-gray-500">
                  Track how sales volume and revenue move together across the last reporting period.
                </p>
              </div>
              {chartData.length === 0 ? (
                <EmptyChartState />
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#E5E7EB" strokeDasharray="8 8" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickMargin={12}
                        axisLine={{ stroke: "#E5E7EB" }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                        allowDecimals={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 16, borderColor: "#111827", backgroundColor: "#111827", color: "#F9FAFB" }}
                        labelStyle={{ color: "#F9FAFB" }}
                        formatter={(value, name) => {
                          if (name === "Revenue") {
                            return [`₦${Number(value).toLocaleString("en-NG")}`, name];
                          }
                          return [Number(value).toLocaleString("en-NG"), name];
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 16 }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#111827"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#111827" }}
                        activeDot={{ r: 6 }}
                        name="Sales"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0EA5E9"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#0EA5E9" }}
                        activeDot={{ r: 6 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsTab;

const MetricCard = ({ title, value, description, icon: Icon, prefix = "" }) => (
  <motion.article
    className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          {title}
        </span>
        <p className="text-3xl font-semibold text-gray-900">
          {prefix}
          {Number(value).toLocaleString("en-NG")}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 text-gray-900">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </motion.article>
);

const SkeletonCard = () => (
  <div className="animate-pulse rounded-[28px] border border-black/10 bg-white px-6 py-7">
    <div className="h-3 w-1/3 rounded-full bg-gray-200" />
    <div className="mt-4 h-7 w-1/2 rounded-full bg-gray-200" />
    <div className="mt-4 h-3 w-2/3 rounded-full bg-gray-200" />
  </div>
);

const EmptyChartState = () => (
  <motion.div
    className="flex h-80 flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-300 bg-white/70 px-8 text-center text-sm text-gray-500"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <span className="rounded-full bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
      Awaiting data
    </span>
    <p className="mt-3 text-base text-gray-700">No sales have been recorded in this window yet.</p>
    <p className="mt-1 max-w-sm">Once orders start flowing in, this chart will map the balance between sales and revenue.</p>
  </motion.div>
);
