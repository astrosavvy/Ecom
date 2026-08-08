export async function checkRateLimit(
  service: any,
  identifier: string,
  type: "email" | "ip",
  maxPerHour: number
): Promise<{ allowed: boolean; remaining: number }> {
  const windowMinutes = 60
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  try {
    const records = await service.listOtpRateLimits({
      identifier,
      identifier_type: type,
      window_start: { $gte: windowStart },
    })

    if (!records || records.length === 0) {
      await service.createOtpRateLimits({
        identifier,
        identifier_type: type,
        request_count: 1,
        window_start: new Date(),
        window_minutes: windowMinutes,
      })
      return { allowed: true, remaining: maxPerHour - 1 }
    }

    const record = records[0]
    if (record.request_count >= maxPerHour) {
      return { allowed: false, remaining: 0 }
    }

    await service.updateOtpRateLimits({
      id: record.id,
      request_count: record.request_count + 1,
    })
    return { allowed: true, remaining: maxPerHour - record.request_count - 1 }
  } catch (e) {
    // Fallback if table not ready or error
    return { allowed: true, remaining: maxPerHour }
  }
}
