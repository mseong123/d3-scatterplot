var margin=40;
var width=900-margin-margin;
var height=420-margin-margin;
var fetchedData;
var svg=d3.select("#svg").append("g")
        .attr("transform","translate("+margin+","+margin+")")


var x=d3.scaleTime().range([0,width])
var y=d3.scaleTime().range([height,0])



        
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(
    data=>{
        fetchedData=data;
        fetchedData.forEach(d=>d.Time=d3.timeParse("%M:%S")(d.Time));
        fetchedData.forEach(d=>d.Year=d3.timeParse("%Y")(d.Year));
        render(fetchedData)
    }
)        

function render(data) {
    x.domain([new Date("1993"),new Date("2016")])
    y.domain(d3.extent(data,d=>d.Time))

   
    //render new axes with transition effect 
    svg.append("g")
            .attr("transform","translate(0,"+height+")")
            .attr("id","x-axis")
            .attr("opacity","0")
        .call(d3.axisBottom(x))
        .transition().duration(1000)
            .attr("opacity","1")
            
    
    svg.append("g")
            .attr("id","y-axis")
            .attr("opacity","0")
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")))
        .transition().duration(1000)
            .attr("opacity","1")

    
    svg.append("text")
            .attr("transform","translate(-15,-15)")
            .attr("class","y-axis-title")
            .text("Time in Minutes")
            .style("fill","#CAFAFE")
            .style("opacity","0")
        .transition().duration(1000)
            .style("opacity","1")

    d3.select("#legend").transition().duration(1000)
            .style("opacity","1")

    svg.selectAll(".dot")
        .data(data).enter().append("circle")
            .attr("cy",d=>{
                if(d.Doping) 
                    return "0" 
                else return height;
            })
            .attr("cx",d=>x(d.Year))
            .attr("r",d=>{
                if(d.Doping) 
                return "7"
                else return "10"
            })
            .style("fill",d=>{
                if(d.Doping) 
                return "black"
                else return "#CAFAFE"
            })
            .attr("opacity","0")
            .attr("class","dot")
            .attr("data-xvalue",d=>d.Year)
            .attr("data-yvalue",d=>d.Time)
            .on("mouseover",(d,i,nodes)=>{
                d3.select("#tooltip")
                        .attr("data-year",d.Year)
                        .html(d.Name+" ("+d.Nationality+")"+"<br>"+"Year: "+d3.timeFormat("%Y")(d.Year)+","+" Time: "+d3.timeFormat("%M:%S")(d.Time)+"<br><br>"+d.Doping)
                        .style("left",(d3.event.pageX+30)+"px")
                        .style("top",(d3.event.pageY-20)+"px")
                    .transition().duration(300)
                        .style("opacity","0.9");

                d3.select(nodes[i]).transition().duration(300)
                        .attr("r","18")
                        .style("stroke-width","3px")
                        .style("stroke","black")
                        .style("fill","#55BCC9") 
                        
                
      
      
                d3.select(".backdrop").style("width",d=>document.documentElement.scrollWidth+"px")
                    .transition().duration(500)
                        .style("opacity","0.8")
                        .style("transform","scale(1)")
      
                        
                        
            })
            .on("mouseout",(d,i,nodes)=>{
                d3.select("#tooltip")
                    .transition().duration(300)
                        .style("opacity","0");

                d3.select(nodes[i]).transition().duration(300)
                        .style("fill",d=>{
                            if(d.Doping) 
                            return "black"
                            else return "#CAFAFE"
                        }) 
                        .style("stroke","none")
                        .attr("r",d=>{
                            if(d.Doping) 
                            return "7"
                            else return "10"
                        })

                d3.select(".backdrop").transition().duration(500)
                        .style("opacity","0")
                        .style("transform","scale(0)")
            }) 
        .transition().duration(1000)
            .attr("cy",d=>y(d.Time))
            .attr("opacity","1")
            
        }

