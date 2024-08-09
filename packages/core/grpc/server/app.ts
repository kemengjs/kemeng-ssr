// grpc服务应用
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

export type grpcNewAppOptions = {
	package: string
	service: string
	protoPath: string
}

class Application {
	package: string
	server: grpc.Server
	service: string
	packageDefinition: protoLoader.PackageDefinition
	grpcObj:
		| grpc.ProtobufTypeDefinition
		| grpc.GrpcObject
		| grpc.ServiceClientConstructor

	private _servers: Record<string, any>

	constructor(options: grpcNewAppOptions) {
		if (!options.package) throw new Error('need package')
		if (!options.service) throw new Error('need service')
		if (!options.protoPath) throw new Error('need protopath')

		this.package = options.package
		this.server = new grpc.Server()
		this.service = options.service

		this.packageDefinition = protoLoader.loadSync(options.protoPath, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		})

		try {
			this.grpcObj = grpc.loadPackageDefinition(this.packageDefinition)[
				options.package
			]
		} catch (e) {
			throw new Error('error package :' + e)
		}
	}
	// 给每个函数加了个path字端
	addService(servicesArg: Record<string, any>) {
		const rpcMap = this.grpcObj[this.service].service
		let services = { ...servicesArg }

		for (let rpcName in rpcMap) {
			if (services[rpcName]) {
				services[rpcName].path = rpcMap[rpcName].path
			}
		}

		this._servers = services
	}

	// 服务关连 + 接口监听
	listen(port: string | number, callback: (err: Error, _port: number) => void) {
		this.server.addService(this.grpcObj[this.service].service, this._servers)
		this.server.bindAsync(
			'0.0.0.0:' + port,
			grpc.ServerCredentials.createInsecure(),
			(e, _port) => {
				callback(e, _port)
			}
		)
	}
}

export default Application
