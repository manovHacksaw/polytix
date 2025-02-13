"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import usePolytix from "@/hooks/usePolytix"
import { VotingRestriction, ResultType } from "@/types/VotingTypes"
import { formSchema } from "./schema"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { BasicInformation } from "./BasicInformation"
import { VoteTypeSelection } from "./form-sections/VoteTypeSelection"
import { ProposalSection } from "./form-sections/ProposalSection"
import { DateSelection } from "./form-sections/DateSelection"
import { VotingSettings } from "./form-sections/VotingSettings"

interface Proposal {
  id: number
  content: string
}

export function CreateVoteForm() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const { isCreatingCampaign, error, dispatchCreateCampaign, contract } = usePolytix()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voteType: "candidate",
      registrationRequired: true,
      candidateRegistration: "creator",
      startDate: "",
      endDate: "",
      title: "",
      description: "",
      maxVoters: "",
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (proposals.length < 2 && values.voteType === "proposal") {
      toast.error("Please add at least 2 proposals")
      return
    }

    if (!contract) {
      toast.error("Contract not loaded. Please refresh the page.")
      return
    }

    try {
      const startTime = Math.floor(new Date(values.startDate).getTime() / 1000)
      const endTime = Math.floor(new Date(values.endDate).getTime() / 1000)
      const maxVoters = values.maxVoters ? Number.parseInt(values.maxVoters) : 0
      const restriction = values.registrationRequired 
        ? VotingRestriction.RequiredRegistration 
        : VotingRestriction.OpenToAll
      const proposalContents = proposals.map((p) => p.content)

      dispatchCreateCampaign(
        values.description,
        restriction,
        ResultType.OneWinner,
        startTime,
        endTime,
        maxVoters,
        proposalContents
      )
      
      toast.loading("Creating vote...", { duration: 3000 })
      form.reset()
      setProposals([])
    } catch (e) {
      toast.error("Failed to create vote. Please try again.")
    }
  }

  const proposalHandlers = {
    add: () => {
      if (proposals.length >= 10) {
        toast.error("Maximum 10 proposals allowed")
        return
      }
      setProposals([...proposals, { id: Date.now(), content: "" }])
    },
    update: (id: number, content: string) => {
      setProposals(proposals.map((p) => (p.id === id ? { ...p, content } : p)))
    },
    remove: (id: number) => {
      setProposals(proposals.filter((p) => p.id !== id))
    }
  }

  return (
    <Card className="border-none bg-background/60 shadow-lg backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInformation form={form} />
              <VoteTypeSelection form={form} />
              
              {form.watch("voteType") === "proposal" && (
                <ProposalSection 
                  proposals={proposals}
                  onAdd={proposalHandlers.add}
                  onUpdate={proposalHandlers.update}
                  onRemove={proposalHandlers.remove}
                />
              )}
              
              <DateSelection form={form} />
              <VotingSettings form={form} />

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Creating a vote requires a transaction on the blockchain. Make sure you have enough ETH to cover the gas fees.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isCreatingCampaign || !contract}
              >
                {isCreatingCampaign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Vote...
                  </>
                ) : !contract ? (
                  "Please Connect Wallet"
                ) : (
                  "Create Vote"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </CardContent>
    </Card>
  )
}