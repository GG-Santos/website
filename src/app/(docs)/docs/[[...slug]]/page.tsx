import type { TOCItemType } from "fumadocs-core/toc";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/docs/mdx-components";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/components/layouts/docs/page";
import { source } from "@/lib/docs/source";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = (
    page.data as {
      body: React.ComponentType<{
        components?: Record<string, React.ComponentType>;
      }>;
    }
  ).body;

  return (
    <DocsPage toc={(page.data as { toc: TOCItemType[] }).toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents() as any} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  return props.params.then(async (params) => {
    const page = source.getPage(params.slug ?? []);
    if (!page) notFound();

    return {
      title: page.data.title,
      description: page.data.description,
    };
  });
}

