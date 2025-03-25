
import { Share, Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare = ({ url, title, description = "" }: SocialShareProps) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || "");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTitle}`,
              "_blank"
            )
          }
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
              "_blank"
            )
          }
        >
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`,
              "_blank"
            )
          }
        >
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`,
              "_blank"
            )
          }
        >
          <Mail className="h-4 w-4 mr-2 text-gray-600" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="h-4 w-4 mr-2 text-gray-600" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
