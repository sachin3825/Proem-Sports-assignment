import React, { useState, useEffect, useRef } from "react";
import { useCampaign } from "@/context/CampaignContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  Smartphone,
  Eye,
  Edit,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

// Draft.js imports
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import "draft-js/dist/Draft.css";

// Custom Draft.js to HTML converter
const stateToHTML = (editorState: EditorState): string => {
  const contentState = editorState.getCurrentContent();
  const rawContentState = convertToRaw(contentState);

  // Simple converter - you might want to use a library like draft-js-export-html
  let html = "";

  rawContentState.blocks.forEach((block: any) => {
    const text = block.text;
    const type = block.type;

    switch (type) {
      case "header-one":
        html += `<h1>${text}</h1>`;
        break;
      case "header-two":
        html += `<h2>${text}</h2>`;
        break;
      case "unordered-list-item":
        html += `<li>${text}</li>`;
        break;
      case "ordered-list-item":
        html += `<li>${text}</li>`;
        break;
      default:
        html += `<p>${text}</p>`;
    }
  });

  return html;
};

// HTML to Draft.js converter
const htmlToState = (html: string): EditorState => {
  if (!html) {
    return EditorState.createEmpty();
  }

  try {
    const blocksFromHTML = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(contentState);
  } catch (error) {
    return EditorState.createEmpty();
  }
};

const Step3MessageEditor = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const [previewMode, setPreviewMode] = useState(false);
  const [messagesByChannel, setMessagesByChannel] = useState<
    Record<string, string>
  >({
    email: "",
    whatsapp: "",
    sms: "",
  });

  // Draft.js state for email editor
  const [emailEditorState, setEmailEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const editorRef = useRef<Editor>(null);

  // Initialize messages from campaign data
  useEffect(() => {
    if (campaignData.message) {
      setMessagesByChannel((prev) => ({
        ...prev,
        [campaignData.channel]: campaignData.message,
      }));

      // Initialize Draft.js state for email
      if (campaignData.channel === "email") {
        setEmailEditorState(htmlToState(campaignData.message));
      }
    }
  }, []);

  const channels = [
    {
      id: "email",
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
      placeholder: "Write your email message here...",
      limit: null,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageSquare className="w-4 h-4" />,
      placeholder: "Write your WhatsApp message here...",
      limit: 4096,
    },
    {
      id: "sms",
      label: "SMS",
      icon: <Smartphone className="w-4 h-4" />,
      placeholder: "Write your SMS message here...",
      limit: 160,
    },
  ];

  const handleChannelChange = (channel: string) => {
    // Save current message before switching
    if (campaignData.channel === "email") {
      const htmlContent = stateToHTML(emailEditorState);
      setMessagesByChannel((prev) => ({
        ...prev,
        email: htmlContent,
      }));
      updateCampaignData({ message: htmlContent });
    } else {
      setMessagesByChannel((prev) => ({
        ...prev,
        [campaignData.channel]: campaignData.message,
      }));
    }

    // Load message for new channel
    const newMessage = messagesByChannel[channel] || "";

    if (channel === "email") {
      const trimmedMessage = newMessage.replace(/^\s+/, "");
      setEmailEditorState(htmlToState(trimmedMessage));
    }

    updateCampaignData({
      channel: channel as "email" | "whatsapp" | "sms",
      message: newMessage,
    });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value.trimStart();
    updateCampaignData({ message: newMessage });
    setMessagesByChannel((prev) => ({
      ...prev,
      [campaignData.channel]: newMessage,
    }));
  };

  // Draft.js handlers
  const handleEmailEditorChange = (editorState: EditorState) => {
    const content = editorState.getCurrentContent();
    const plainText = content.getPlainText().trim();

    if (!plainText) {
      setEmailEditorState(EditorState.createEmpty());
      updateCampaignData({ message: "" });
      return;
    }

    setEmailEditorState(editorState);

    const htmlContent = stateToHTML(editorState).trim();
    updateCampaignData({ message: htmlContent });

    setMessagesByChannel((prev) => ({
      ...prev,
      email: htmlContent,
    }));
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEmailEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onBoldClick = () => {
    handleEmailEditorChange(
      RichUtils.toggleInlineStyle(emailEditorState, "BOLD")
    );
  };

  const onItalicClick = () => {
    handleEmailEditorChange(
      RichUtils.toggleInlineStyle(emailEditorState, "ITALIC")
    );
  };

  const onUnderlineClick = () => {
    handleEmailEditorChange(
      RichUtils.toggleInlineStyle(emailEditorState, "UNDERLINE")
    );
  };

  const insertPersonalizationToken = (token: string) => {
    if (campaignData.channel === "email") {
      const contentState = emailEditorState.getCurrentContent();
      const selection = emailEditorState.getSelection();
      const { Modifier } = require("draft-js");

      const newContentState = Modifier.insertText(
        contentState,
        selection,
        token,
        emailEditorState.getCurrentInlineStyle()
      );

      const newEditorState = EditorState.push(
        emailEditorState,
        newContentState,
        "insert-characters"
      );

      const withSelection = EditorState.forceSelection(
        newEditorState,
        newContentState.getSelectionAfter()
      );

      handleEmailEditorChange(withSelection);

      setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
    } else {
      const textarea = document.getElementById(
        "message"
      ) as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newMessage =
          campaignData.message.substring(0, start) +
          token +
          campaignData.message.substring(end);
        updateCampaignData({ message: newMessage });
        setMessagesByChannel((prev) => ({
          ...prev,
          [campaignData.channel]: newMessage,
        }));
      }
    }
  };

  const currentChannel = channels.find((c) => c.id === campaignData.channel);
  const messageLength = campaignData.message.length;
  const isOverLimit =
    currentChannel?.limit && messageLength > currentChannel.limit;

  const renderPersonalizationTokens = (message: string): string => {
    return message.replace(/\{\{(\w+)\}\}/g, (match, token) => {
      const replacements: Record<string, string> = {
        first_name: "Sachin",
        last_name: "Kumawat",
        email: "Sachin.Kumawat@example.com",
        company: "XYZ Corp",
      };
      return replacements[token] || match;
    });
  };

  const renderPreview = () => {
    const previewMessage = renderPersonalizationTokens(campaignData.message);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Message Preview</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(false)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            {campaignData.channel === "email" ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Subject: Your Campaign Message
                </div>
                <div className="border-t pt-2">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderPersonalizationTokens(
                        stateToHTML(emailEditorState)
                      ),
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {currentChannel?.icon}
                  <span className="text-sm font-medium">
                    {currentChannel?.label} Message
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words overflow-auto">
                  {previewMessage}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRichTextToolbar = () => (
    <div className="flex items-center space-x-1 p-2 border-b bg-gray-50 dark:bg-gray-800 rounded-t-md">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBoldClick}
        className={`p-2 ${
          emailEditorState.getCurrentInlineStyle().has("BOLD")
            ? "bg-gray-200 dark:bg-gray-600"
            : ""
        }`}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onItalicClick}
        className={`p-2 ${
          emailEditorState.getCurrentInlineStyle().has("ITALIC")
            ? "bg-gray-200 dark:bg-gray-600"
            : ""
        }`}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUnderlineClick}
        className={`p-2 ${
          emailEditorState.getCurrentInlineStyle().has("UNDERLINE")
            ? "bg-gray-200 dark:bg-gray-600"
            : ""
        }`}
      >
        <Underline className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          Select Message Channel
        </Label>
        <Tabs value={campaignData.channel} onValueChange={handleChannelChange}>
          <TabsList className="grid w-full grid-cols-3">
            {channels.map((channel) => (
              <TabsTrigger
                key={channel.id}
                value={channel.id}
                className="flex items-center space-x-2"
              >
                {channel.icon}
                <span>{channel.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {channels.map((channel) => (
            <TabsContent key={channel.id} value={channel.id} className="mt-6">
              {!previewMode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message" className="text-base font-medium">
                      Message Content
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(true)}
                      disabled={!campaignData.message.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {channel.id === "email" ? (
                      <div className="border rounded-md">
                        {renderRichTextToolbar()}
                        <div className="min-h-[200px] p-3">
                          <Editor
                            ref={editorRef}
                            editorState={emailEditorState}
                            onChange={handleEmailEditorChange}
                            handleKeyCommand={handleKeyCommand}
                            placeholder="Write your email message here..."
                          />
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        id="message"
                        placeholder={channel.placeholder}
                        value={campaignData.message}
                        onChange={handleMessageChange}
                        rows={8}
                        className={`resize-none ${
                          isOverLimit
                            ? "border-red-300 focus:border-red-500 dark:border-red-600 dark:focus:border-red-500"
                            : ""
                        }`}
                      />
                    )}

                    {channel.id !== "email" && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span
                            className={
                              isOverLimit
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            }
                          >
                            {messageLength}
                            {channel.limit && ` / ${channel.limit}`} characters
                          </span>
                          {isOverLimit && (
                            <Badge variant="destructive">Over limit</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personalization tokens */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      Personalization Tokens
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                      Add these tokens to personalize your message:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "{{first_name}}",
                        "{{last_name}}",
                        "{{email}}",
                        "{{company}}",
                      ].map((token) => (
                        <Badge
                          key={token}
                          variant="secondary"
                          className="cursor-pointer text-xs hover:bg-purple-100 dark:hover:bg-purple-800"
                          onClick={() => insertPersonalizationToken(token)}
                        >
                          {token}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                renderPreview()
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Step3MessageEditor;
