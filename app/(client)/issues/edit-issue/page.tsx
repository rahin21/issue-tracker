"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(
	() => import("react-simplemde-editor"),
	{ ssr: false }
);
import "easymde/dist/easymde.min.css";
import { z } from "zod";
import { issuesTypeI } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusStyle from "@/components/status-style";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  status: z.string().min(2, {
    message: "Status must be selected.",
  }),
});

const EditIssue = ({ searchParams }: { searchParams: { id:string } }) => {
  const router = useRouter();
  const [data, setData] = useState<issuesTypeI>();
  useEffect(() => {
    const uniqueIssue = async () => {
      try {
        await axios
          .get(`/api/issue/${searchParams.id|| "id"}`)
          .then((res: AxiosResponse) => {
            setData(res.data);
          });
      } catch (error) {
        console.log(error);
      }
    };
    uniqueIssue();
  }, [searchParams.id]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      title: data?.title || "Loading...",
      description: data?.description || "Loading...",
      status: data?.status || "",
    },
  });

  const onUpdate: (data: z.infer<typeof FormSchema>) => Promise<void> = async (data) => {
    try {
      await axios
        .post(`/api/issue/${searchParams.id}`, data)
        .then((res: AxiosResponse) => console.log(res))
        .catch((err: Error) => {
          console.log(err);
        });
      router.push("/issues");
    } catch (error) {
      console.log(error);
    }
  };
  const Delete = async () => {
    try {
      await axios
        .delete(`/api/issue?id=${searchParams.id}`)
        .then(() => console.log(`Issue Deleted`))
        .catch((err: Error) => console.log(err));
        router.push("/issues");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center md:my-[7rem] my-[5rem]">
      <h1 className="text-3xl font-bold">Edit Issue</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUpdate)}
          className="md:w-2/3 space-y-6"
        >
          <div className="md:flex justify-between items-center">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                      className="lg:w-[42rem] md:w-[25rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem  className="md:mt-0 mt-5">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={<StatusStyle status={field.value}/>}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"Open"} >
                        <StatusStyle status="Open" className="dark:border-0"/>{" "}
                      </SelectItem>
                      <SelectItem value="Closed" >
                        <StatusStyle status="Closed" className="dark:border-0"/>{" "}
                      </SelectItem>
                      <SelectItem value="In Progress">
                        <StatusStyle status="In Progress" className="dark:border-0"/>{" "}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <SimpleMDE {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button className="bg-rose-600 hover:bg-rose-500" onClick={Delete}>
              Delete
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditIssue;
