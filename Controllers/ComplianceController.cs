using Microsoft.AspNetCore.Mvc;

namespace CompliAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplianceController : ControllerBase
    {
        // GET: api/compliance/status
        [HttpGet("status")]
        public IActionResult GetComplianceStatus()
        {
            // Mock but dynamic data (FREE, no AI, no DB)
            var response = new
            {
                company = "ACME GmbH",
                country = "Germany",
                overallComplianceScore = Random.Shared.Next(65, 95),
                riskLevel = "Medium",
                issuesFound = Random.Shared.Next(1, 6),
                lastScan = DateTime.UtcNow
            };

            return Ok(response);
        }

        // POST: api/compliance/run
        [HttpPost("run")]
        public IActionResult RunComplianceScan()
        {
            // Later: AI / rules engine / DB logic
            return Ok(new
            {
                message = "Compliance scan completed successfully",
                scanTime = DateTime.UtcNow
            });
        }
    }
}
