"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { formSchema } from "./schema";
import { z } from "zod";

interface Proposal {
  id: string;
  content: string;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  values: z.infer<typeof formSchema>;
  proposals: Proposal[];
  onCreateVote: (values: z.infer<typeof formSchema>) => Promise<void>;
  isCreating: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  values,
  proposals,
  onCreateVote,
  isCreating,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            Confirm Vote Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please review the following details carefully. Once created,
            these details cannot be modified on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-4 py-2">
          <div className="space-y-6">
            <Section
              title="Basic Information"
              description="Check your campaign title and description carefully."
            >
              <InfoItem label="Title" value={values.title} />
              <InfoItem label="Description" value={values.description} />
            </Section>

            <Section
              title="Voting Type"
              description="Confirm the voting type is correct."
            >
              <InfoItem
                label="Type"
                value={values.voteType === "candidate" ? "Candidate Voting" : "Proposal Voting"}
              />
            </Section>

            {values.voteType === "proposal" && proposals.length > 0 && (
              <Section
                title="Proposals"
                description="Review your proposals before submitting."
              >
                <ul className="list-disc pl-5 text-sm space-y-2">
                  {proposals.map((proposal) => (
                    <li key={proposal.id} className="text-gray-700">{proposal.content}</li>
                  ))}
                </ul>
              </Section>
            )}

            <Section
              title="Dates"
              description="Ensure the start and end dates are accurate."
            >
              <InfoItem
                label="Start Date & Time"
                value={new Date(values.startDate).toLocaleString()}
              />
              <InfoItem
                label="End Date & Time"
                value={new Date(values.endDate).toLocaleString()}
              />
            </Section>

            <Section
              title="Voting Settings"
              description="Confirm your voting settings are configured as desired."
            >
              <InfoItem
                label="Registration Required"
                value={values.registrationRequired ? "Yes" : "No"}
              />
              <InfoItem
                label="Max Voters"
                value={values.maxVoters || "Unlimited"}
              />
            </Section>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onCreateVote(values)}
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Confirm and Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Section: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
    <div className="mt-3">{children}</div>
  </motion.div>
);

const InfoItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-2 text-sm py-1">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default ConfirmationDialog;