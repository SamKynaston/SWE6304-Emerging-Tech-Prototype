import { SEND_REQUEST_TO_MODEL_DEMO } from "../middleware/models.middleware";

describe("SEND_REQUEST_TO_MODEL_DEMO", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("chains requests with the previous response ID and returns only the final message", async () => {
        const fetchMock = jest.spyOn(global, "fetch")
            .mockResolvedValueOnce(new Response(JSON.stringify({
                output: [
                    { type: "reasoning", content: "Private reasoning text" },
                    { type: "message", content: "Final answer" },
                ],
                response_id: "resp_first",
            }), { status: 200 }),
            )
            .mockResolvedValueOnce(new Response(JSON.stringify({
                output: [{ type: "message", content: "Follow-up answer" }],
                response_id: "resp_second",
            }), { status: 200 }));

        await expect(SEND_REQUEST_TO_MODEL_DEMO("Question")).resolves.toEqual({
            text: "Final answer",
            responseId: "resp_first",
        });
        await expect(SEND_REQUEST_TO_MODEL_DEMO("Follow up", "resp_first")).resolves.toEqual({
            text: "Follow-up answer",
            responseId: "resp_second",
        });

        const secondRequest = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
        expect(secondRequest).toMatchObject({
            input: "Follow up",
            store: true,
            previous_response_id: "resp_first",
        });
    });
});
