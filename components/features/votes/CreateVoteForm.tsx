"use client";
import abi from "@/abi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import usePolytix from "@/hooks/usePolytix";
import { VotingRestriction, ResultType } from "@/types/VotingTypes";
import { formSchema } from "./schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInformation } from "./BasicInformation";
import { VoteTypeSelection } from "./form-sections/VoteTypeSelection";
import { ProposalSection } from "./form-sections/ProposalSection";
import { VotingSettings } from "./form-sections/VotingSettings";
import * as z from "zod";
import ConfirmationDialog from "./ConfirmationDialog";
import { ethers } from "ethers";
import { CustomDatePicker } from "./form-sections/CustomDatePicker";  // Import the custom date picker

interface Proposal {
  id: number;
  content: string;
}

export function CreateVoteForm() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const { contractAddress } = usePolytix();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voteType: "proposal",
      registrationRequired: true,
      candidateRegistration: "creator",
      startDate: "",
      endDate: "",
      title: "",
      description: "",
      maxVoters: "",
      registrationKey: "",
    },
  });

  const handleCreateVote = async (values: z.infer<typeof formSchema>) => {
    if (proposals.length < 2 && values.voteType === "proposal") {
      toast.error("Please add at least 2 proposals");
      return;
    }

    if (!contractAddress) {
      toast.error("Contract not loaded. Please refresh the page.");
      return;
    }

    if (!startDate || !endDate) {
        toast.error("Please select a start and end date.");
        return;
    }

    try {
      setIsCreatingCampaign(true);
      const startTime = Math.floor(startDate.getTime() / 1000);
      const endTime = Math.floor(endDate.getTime() / 1000);
      const maxVoters = values.maxVoters ? Number.parseInt(values.maxVoters) : 0;
      const restriction: number = values.registrationRequired
        ? VotingRestriction.RequiredRegistration
        : VotingRestriction.OpenToAll;
      const proposalContents = proposals.map((p) => p.content);

      const registrationKeyBytes32 = ethers.keccak256(ethers.toUtf8Bytes(values.registrationKey));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.createProposalBasedCampaign(
        values.description,
        restriction,
        ResultType.OneWinner,
        startTime,
        endTime,
        maxVoters,
        registrationKeyBytes32,
        proposalContents
      );

      toast.promise(tx.wait(), {
        loading: 'Creating vote on the blockchain...',
        success: 'Vote created successfully!',
        error: 'Failed to create vote'
      });

      await tx.wait();
      setIsConfirmationOpen(false);
      form.reset();
      setProposals([]);
      setStartDate(null);
      setEndDate(null);

    } catch (e: any) {
      console.error("Error during campaign creation:", e);
      toast.error(`Failed to create vote: ${e.message || "Unknown error"}`);
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (proposals.length < 2 && values.voteType === "proposal") {
      toast.error("Please add at least 2 proposals");
      return;
    }

    if (!startDate || !endDate) {
        toast.error("Please select a start and end date.");
        return;
    }

    setIsConfirmationOpen(true);
  };

  const proposalHandlers = useCallback(
    {
      add: () => {
        if (proposals.length >= 10) {
          toast.error("Maximum 10 proposals allowed");
          return;
        }
        setProposals([...proposals, { id: Date.now(), content: "" }]);
      },
      update: (id: number, content: string) => {
        setProposals(
          proposals.map((p) => (p.id === id ? { ...p, content } : p))
        );
      },
      remove: (id: number) => {
        setProposals(proposals.filter((p) => p.id !== id));
      },
    },
    [proposals]
  );

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  return (
    <Card className="border-none bg-white/95 shadow-xl backdrop-blur-sm max-w-3xl mx-auto">
      
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8">
                <BasicInformation form={form} />
                <VoteTypeSelection form={form} />

                <AnimatePresence>
                  {form.watch("voteType") === "proposal" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProposalSection
                        proposals={proposals}
                        onAdd={proposalHandlers.add}
                        onUpdate={proposalHandlers.update}
                        onRemove={proposalHandlers.remove}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Use CustomDatePicker component */}
                <CustomDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                />

                <VotingSettings form={form} />

              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700">Important</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Creating a vote requires a transaction on the blockchain.
                  Make sure you have enough ETH to cover the gas fees.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5"
                onClick={() => setIsConfirmationOpen(true)}
                disabled={isCreatingCampaign || !contractAddress || !startDate || !endDate}
              >
                {isCreatingCampaign ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Vote...
                  </>
                ) : !contractAddress ? (
                  "Please Connect Wallet"
                ) : (
                  "Create Vote"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </CardContent>
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        values={form.getValues()}
        proposals={proposals}
        onCreateVote={handleCreateVote}
        isCreating={isCreatingCampaign}
        startDate={startDate}
        endDate={endDate}
      />
    </Card>
  );
}