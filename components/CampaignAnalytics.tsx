"use client";

  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    XAxis,
    YAxis,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    CartesianGrid,
  } from "recharts";
  import { motion, AnimatePresence } from "framer-motion";
  import { useEffect, useState } from "react";
  import { Badge } from "@/components/ui/badge";
  import { Progress } from "@/components/ui/progress";
  import { Skeleton } from "@/components/ui/skeleton";
  import { PieChart as PieChartIcon, BarChart3, Users, Trophy, TrendingUp } from "lucide-react";
  import type { Campaign } from "@/types/Campaign";
  
  interface CampaignAnalyticsProps {
    campaign: Campaign;
    proposals: any;
  }
  
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))",
  ];
  
  export default function CampaignAnalytics({ campaign, proposals }: CampaignAnalyticsProps) {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      setIsLoading(true);
      if (proposals && proposals.length > 0) {
        const formattedData = proposals.map((proposal, index) => ({
          name: String(proposal[0]).length > 20 
            ? String(proposal[0]).substring(0, 20) + "..." 
            : String(proposal[0]),
          fullName: String(proposal[0]),
          votes: Number(proposal[1]),
          percentage: ((Number(proposal[1]) / campaign.maxVoters) * 100).toFixed(1),
          fill: COLORS[index % COLORS.length],
        }));
        setChartData(formattedData);
        setTimeout(() => setIsLoading(false), 500);
      }
    }, [proposals, campaign.maxVoters]);
  
    const totalVotes = chartData.reduce((sum, data) => sum + data.votes, 0);
    const participationRate = campaign.maxVoters ? (totalVotes / campaign.maxVoters) * 100 : 0;
    const winningProposal = chartData.reduce(
      (prev, current) => (current.votes > prev.votes ? current : prev),
      { name: 'No Data', votes: 0, fullName: 'No Data' }
    );
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    };
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    };
  
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-lg">
            <p className="font-medium mb-2">{payload[0].payload.fullName}</p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex justify-between gap-4">
                Votes: <span className="font-medium text-foreground">{payload[0].value.toLocaleString()}</span>
              </p>
              <p className="text-sm text-muted-foreground flex justify-between gap-4">
                Share: <span className="font-medium text-foreground">{payload[0].payload.percentage}%</span>
              </p>
            </div>
          </div>
        );
      }
      return null;
    };
  
    if (isLoading) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-[140px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[100px]" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[120px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[350px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
  
    return (
      <AnimatePresence>
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Total Votes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <motion.div
                      className="text-3xl font-bold text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {totalVotes.toLocaleString()}
                    </motion.div>
                    <Progress value={participationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
  
            <motion.div variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Participation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <motion.div
                      className="text-3xl font-bold text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {participationRate.toFixed(1)}%
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      of {campaign.maxVoters.toLocaleString()} eligible voters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
  
            <motion.div variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Leading Proposal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <motion.div
                      className="text-xl font-semibold text-primary line-clamp-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {winningProposal.fullName}
                    </motion.div>
                    <Badge variant="secondary" className="bg-primary/10">
                      {((winningProposal.votes / totalVotes) * 100).toFixed(1)}% of votes
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <CardTitle>Vote Distribution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="votes"
                        radius={[4, 4, 0, 0]}
                        animationBegin={800}
                        animationDuration={1000}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
  
            <motion.div variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5 text-primary" />
                    <CardTitle>Vote Share</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="votes"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={4}
                        animationBegin={1000}
                        animationDuration={1000}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value, entry) => (
                          <span className="text-sm">
                            {entry.payload.fullName}
                            <span className="ml-2 text-muted-foreground">
                              ({entry.payload.percentage}%)
                            </span>
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }