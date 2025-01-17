"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosResponse } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import React from "react";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CreateIssuePage() {
  const router = useRouter();
  const { data: issues, mutate } = useSWR("/api/issues", fetcher); // SWR for fetching issues

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Navigate to the issues page
      router.push("/issues");
      const response = await axios.post("/api/auth/createIssue", {
        title: data.title,
        description: data.description,
        status: "Open",
      });
      
      // Optimistically update the cache
      mutate([...issues, response.data], false);
      
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  return (
    <div className="flex flex-col items-center md:my-[7rem] my-[5rem]">
      <h1 className="text-3xl font-bold">Create Issue</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel id="description">Description</FormLabel>
                <FormControl>
                  <SimpleMDE {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Create An Issue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
