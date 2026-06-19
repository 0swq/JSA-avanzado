export const iaServicio = {
    async completar(sistema: string, texto: string): Promise<string> {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: sistema },
                    { role: 'user', content: texto },
                ],
            }),
        });

        const data = await response.json() as { choices: { message: { content: string } }[] };
        return data.choices[0].message.content;
    },
};