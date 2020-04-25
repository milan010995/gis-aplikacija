using Backend_App.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_App.Services
{
    public class VehicleService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<VehicleService> _logger;
        private List<VehiclePoint> _vehicleList = null;

        public VehicleService(ILogger<VehicleService>  logger,IWebHostEnvironment hostingEnvironment)
        {

            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
            LoadData();
        }

        public void LoadData()
        {
            StreamReader streamReader = null;
            _vehicleList = new List<VehiclePoint>();
            string path = Path.Combine(_hostingEnvironment.ContentRootPath, "Data\\AVL_DataPoints.txt");
            try
            {
                string line = string.Empty;
                using (streamReader = new StreamReader(path))
                {
                    line = streamReader.ReadLine();
                    while ((line = streamReader.ReadLine()) != null)
                    {
                        string[] parameters = line.Split('\t');
                        _vehicleList.Add(new VehiclePoint()
                        {
                            Id = Int32.Parse(parameters[0]),
                            valid = Convert.ToInt32(parameters[1]) > 0 ? true : false,
                            DateTime = DateTime.Parse(parameters[2]),
                            Lat = Double.Parse(parameters[3]),
                            Lon = Double.Parse(parameters[4]),
                            Speed = Double.Parse(parameters[5]),
                            Course = Double.Parse(parameters[6])
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "VehicleService");
            }
            finally
            {
                if (streamReader != null)
                {
                    streamReader.Close();
                    streamReader.Dispose();
                }
            }
        }

        public IList<VehiclePoint> GetByVehicleId(int vehicleId)
        {
          return  _vehicleList.Where(x => x.Id == vehicleId).ToList();
        }
    }
}
