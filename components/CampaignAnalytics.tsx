"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell, // Import Cell for customizing colors
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Campaign } from "@/types/Campaign";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CampaignAnalyticsProps {
  campaign: Campaign;
  proposals: any; // Change to "any" since proposals is dynamic
}

// Define consistent color palette
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#a45ef4",
  "#d35ccf",
  "#46b8da",
  "#ef798a",
  "#80deea",
  "#ffab40",
  "#f06292",
]; // Extended color palette

export default function CampaignAnalytics({ campaign, proposals }: CampaignAnalyticsProps) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Transform the proposals into a format suitable for Recharts
    if (proposals && proposals.length > 0) {
      const formattedData = proposals.map((proposal, index) => ({
        name: String(proposal[0]).length > 20 ? String(proposal[0]).substring(0, 20) + "..." : String(proposal[0]), // Force to string for Recharts
        votes: Number(proposal[1]), // Ensure votes are numbers,
        fill: COLORS[index % COLORS.length],
      }));
      setChartData(formattedData);
    }
  }, [proposals]);

  console.log(chartData)

  const totalVotes = chartData.reduce((sum, data) => sum + data.votes, 0);
  const participationRate = campaign.maxVoters ? (totalVotes / campaign.maxVoters) * 100 : 0;
    const winningProposal = chartData.reduce((prev, current) =>
        current.votes > prev.votes ? current : prev, {name: 'No Data', votes: 0}
    );


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {totalVotes}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Participation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {participationRate.toFixed(1)}%
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Winning Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-xl font-semibold text-primary line-clamp-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {winningProposal.name}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Votes Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  name: "Votes",
                }}
                className="h-[350px] w-[450px]"
              >
                <BarChart data={chartData} key={chartData.length}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <Bar
                    dataKey="votes"
                    radius={[4, 4, 0, 0]}
                    animationBegin={800}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Vote Share</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={
                    chartData.reduce((config, data, index) => {
                        config[`proposal${index}`] = {
                            label: data.name,
                            color: COLORS[index % COLORS.length],
                        };
                        return config;
                    }, {})
                }
                className="h-[350px]"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="votes"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    animationBegin={1000}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {/* <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center hover:[&>*]:opacity-80 transition-opacity"
                  /> */}
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}