import Link from "next/link"
import { FileText, Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SpecPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center size-14 rounded-xl bg-primary text-primary-foreground">
            <FileText className="size-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            WAB Front-End UX/UI Spec
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">
            Standalone specification document for the Weekend Availability Board front-end.
            Ready to feed into any AI coding agent.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document Details</CardTitle>
            <CardDescription>Version 1.0 &middot; February 18, 2026</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sections</span>
                <span className="font-medium text-foreground">16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screens Covered</span>
                <span className="font-medium text-foreground">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Components Documented</span>
                <span className="font-medium text-foreground">14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scope</span>
                <span className="font-medium text-foreground">Front-end only</span>
              </div>
            </div>

            <a href="/WAB_Frontend_UX_UI_Spec.pdf" download>
              <Button className="w-full" size="lg">
                <Download className="size-4" />
                Download PDF
              </Button>
            </a>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" />
              Back to Prototype
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
