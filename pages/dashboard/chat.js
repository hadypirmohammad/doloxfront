import DashboardPanel from "@/components/global/DashboardPanel";
import ChatPanel from "@/components/Chat/ChatPanel";
import { getToken, withAuth } from "@/utils/Auth";
import { getUser } from "@/utils/Request";
import { resolveCurrentUserId } from "@/utils/chat/userId";
import { PREVIEW_WITHOUT_LOGIN } from "@/utils/Auth";
import {
  PREVIEW_USER_ID,
  buildMockMessages,
  mockConversations,
  mockProfile,
} from "@/utils/services/preview.mock";
import { useRouter } from "next/router";
import React from "react";

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);
  if (authResult.redirect) {
    return authResult;
  }

  const token = await getToken(context);
  const profileData = await getUser(token).catch(() => null);

  return {
    props: {
      token: token || "",
      profileData: profileData || {},
    },
  };
}

const ChatPage = ({ user, token, profileData }) => {
  const router = useRouter();
  const realUserId = resolveCurrentUserId(token, profileData);
  const userId = realUserId || (PREVIEW_WITHOUT_LOGIN ? PREVIEW_USER_ID : null);
  const previewMode = PREVIEW_WITHOUT_LOGIN;
  const queryReady = router.isReady;
  const queryReceiverId = queryReady
    ? Array.isArray(router.query.receiverId)
      ? router.query.receiverId[0]
      : router.query.receiverId ??
        (Array.isArray(router.query.userId)
          ? router.query.userId[0]
          : router.query.userId)
    : null;
  const queryTitle = queryReady
    ? Array.isArray(router.query.title)
      ? router.query.title[0]
      : router.query.title
    : null;
  const initialReceiverId =
    queryReady && Number.isFinite(Number(queryReceiverId))
      ? Number(queryReceiverId)
      : null;
  const initialPeerLabel =
    queryReady && typeof queryTitle === "string"
      ? decodeURIComponent(queryTitle)
      : "";

  return (
    <div dir="rtl" className="flex h-fit w-full justify-start gap-4 bg-[#f3f4f6] px-0 pb-0 pt-6 md:px-4 md:pb-10 md:pt-8">
      <div className="hidden md:block">
        <DashboardPanel user={user} />
      </div>
      <div className="h-full w-full min-w-0 flex-1">
        <div className="flex w-full flex-col">
          {!userId ? (
            <div className="h-96 flex justify-center items-center font-[vazir] text-base-content/60">
              شناسه کاربر یافت نشد. لطفاً دوباره وارد شوید.
            </div>
          ) : (
            <ChatPanel
              token={token}
              userId={userId}
              initialReceiverId={initialReceiverId}
              initialPeerLabel={initialPeerLabel}
              previewConversations={previewMode ? mockConversations : null}
              previewMessages={previewMode ? buildMockMessages(userId) : null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
