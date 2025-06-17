import { Request, Response, NextFunction } from "express-serve-static-core";
import performanceService from "../../../../../lib/performance";
import { performanceMioQuerySchema } from "../../../../../schemas/performance";
import { paginate } from "../../../../../utils/pagination";
import { PerformanceMios } from "../../../../../types/performance";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = performanceMioQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data }: { data: PerformanceMios[] } =
      await performanceService.getMultiMioPerformance(validatedData);

    const responseData = {
      success: true,
      message: "All Mio performance get successfully!",
      data: data
        ? data.map((item) => {
            return {
              sap_id: item.sap_id,
              full_name: item.full_name,
              team_title: item.team_title,
              total_score: Number(item.total_score),
            };
          })
        : [],
      pagination: {
        ...paginate(
          validatedData.page,
          validatedData.size,
          Number(data?.[0]?.total_count ?? 0)
        ),
      },
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getMioPerformance };
