import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { issuesTypeI } from "@/types/types";
import StatusStyle from "./status-style";
import { EyeIcon, View } from "lucide-react";


const ViewButton = (props: {issue:issuesTypeI}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="view" className="px-3"><EyeIcon/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.issue.title}</DialogTitle>
        </DialogHeader>
        <div className="space-x-2 ">
          <DialogTitle>Description: </DialogTitle>
          <DialogDescription>
            <MarkdownPreview className="mt-2 ml-[-8px]" style={{fontSize:"20px"}} source={props.issue.description} />
          </DialogDescription>
        </div>
        <div className="flex items-center space-x-2">
          <DialogTitle>Status: </DialogTitle>
          <StatusStyle status={props.issue.status} />
        </div>
        <div className="flex items-center space-x-2">
          <DialogTitle>Created At: </DialogTitle>
          <DialogDescription>
            {String(new Date(props.issue.createdAt)).slice(0, -35)}
          </DialogDescription>
        </div>
        <div className="flex items-center space-x-2">
          <DialogTitle>Updated At: </DialogTitle>
          <DialogDescription>
            {String(new Date(props.issue.updatedAt)).slice(0, -35)}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewButton;
