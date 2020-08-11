using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_App.Models;
using Backend_App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend_App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PointController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly VehicleService _vehicleService;
        private readonly SensorsService _sensorService;

        public PointController(ILogger<WeatherForecastController> logger, VehicleService vehicleService, SensorsService sensorsService)
        {
            _logger = logger;
            _vehicleService = vehicleService;
            _sensorService = sensorsService;
        }


        [HttpGet]
        public IEnumerable<VehiclePoint> Get(int count)
        {
            return _vehicleService.GetVehiclePointsFirst(4573, count);
        }
    }
}
